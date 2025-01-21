import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../store/AppProvider";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CartSummary } from "./CartSummary";
import { Coupon } from "./Coupon";
import { ShippingMethod } from "./ShippingMethod";


export function Checkout() {
  const API_BASE_URL = process.env.REACT_APP_STRIPE_CHECKOUT_URL;
  const navigate = useNavigate(); 
 
  const stripe = useStripe();
  const elements = useElements();
  const {state, formatPrice} = useAppContext();
  const {cartItems, isMobile, userInfo } = state;
  let user_fname = userInfo.name.split(' ')[0] || '';
  let user_lname = userInfo.name.split(' ')[1] || '';
  let user_email = userInfo.email;
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [allowPayment, setAllowPayment] = useState(false);
  const customerAddress = JSON.parse(localStorage.getItem('customer_address')) || {};
  const savedAddress = JSON.parse(localStorage.getItem('customer_address')) || {
    firstName: user_fname, lastName: user_lname, email: user_email, address: '', city: '', state: '', zip: '', country: '' };
  const checkoutType = 'stripe';
  const [cartTotal, setCartTotal] = useState(0);
  const [cartSubTotal, setCartSubTotal] = useState(0);
  const shippingMethods = [
    { id: 1, name: "Free Shipping", amount: 0, info: "Deliver within 5-7 Days" },
    { id: 2, name: "First Day Prior", amount: 15, info: "Deliver on Next Day" },
  ];
  const [shipping, setShipping] = useState(shippingMethods[0]);

  const [coupon, setCoupon] = useState([]);

  function validateBilling(formData){
    var errors = {};
    if(formData.firstName === ''){
      errors.firstName = 'First Name should not blank!';
    } else if(formData.lastName === ''){
      errors.lastName = 'Last Name should not blank!';
    }else if(formData.email === ''){
      errors.email = 'Email should not blank!';
    }else if(formData.address === ''){
      errors.address = 'Address should not blank!';
    }else if(formData.city === ''){
      errors.city = 'City should not blank!';
    }else if(formData.state === ''){
      errors.state = 'State should not blank!';
    }else if(formData.zip === ''){
      errors.zip = 'Zip should not blank!';
    }else if(formData.country === ''){
      errors.country = 'Country should not blank!';
    }
   // console.log("Errors",errors);
    return errors;
    
  }

  const saveCheckout = (billing, orderNo) => {
      if(billing.saveInfo==='yes' || billing.saveInfo === true){
        let getAddress = {
          firstName:billing.firstName,
          lastName:billing.lastName,
          email:billing.email,
          address:billing.address,
          address2: billing.address2,
          city:billing.city,
          state:billing.state,
          zip:billing.zip,
          country:billing.country,
        }
        localStorage.setItem('customer_address',  JSON.stringify(getAddress));
      }
      else
      {
        localStorage.removeItem('customer_address')
      }
    
      const currentOrder = 
          {
          'orderNumber':orderNo,
          'subTotal': cartSubTotal,
          'total': cartTotal,
          'coupon': coupon?.code || '',
          'discount': coupon?.cartDiscount || '',
          'shipping' : shipping,
          'paymentMethod': billing.paymentMethod,
          'items': cartItems
          };
      
      localStorage.setItem('lastOrder', JSON.stringify(currentOrder));
  }

  const formik = useFormik({
    initialValues: {  
      ...savedAddress,
      saveInfo: customerAddress?true:false,
    },
    validate: validateBilling,
    onSubmit: async (billing) => {
       const orderNo = Date.now();
       saveCheckout(billing, orderNo);
       if(checkoutType === 'stripe')
       {
          setSubmitting(true);
          console.log("Checkout Session: ",`${API_BASE_URL}/create-checkout-session`);
          let orderData = {
            items: cartItems,
            discountAmount: Number(coupon.cartDiscount) || 0,
            couponCode: coupon.code || '',
            shipping:shipping,
            customerEmail: billing.email,
            customerName:billing.firstName+' '+billing.lastName,
            order_id: orderNo
          }
          //console.log(orderData);
          const response = await fetch(`${API_BASE_URL}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData),
          });

          //console.log("Response:",response);

          if(!response.ok){
              console.log("error to generate checkout session", response);
          }

        /*   const result = await response.json();
          console.log(result); */
      
          const { url } = await response.json();
          console.log(url);
          window.location.href = url;
       }
       else
       {
          if (!stripe || !elements) {
           // setStripeError("Stripe has not loaded yet.");
            setSubmitting(false);
            return;
          }
          setSubmitting(true);
    
          const response = await fetch("create-payment-intent", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: cartTotal }), // Replace with your dynamic amount
          });
      
          const { clientSecret } = await response.json();
          const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            receipt_email: billing.email,
            payment_method: {
              card: elements.getElement(CardElement),
            },
          });
    
          if (error) {
            setMessage(`Payment failed: ${error.message}`);
          } else if (paymentIntent.status === "succeeded") {
            setMessage("Payment successful!");
            console.log(paymentIntent);
          }      
          setSubmitting(false);
       }
      
    },
    enableReinitialize: true
  })

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/");
    }

    if (!userInfo && userInfo === '') {
      navigate("/signin");
    }

    document.title = `Checkout with ${cartItems.length} item(s)`;

    if(checkoutType ==='stripe'){
      setAllowPayment(true);
    }
    else{
      setAllowPayment(false);
    }

    let calcSubTotal = cartItems.reduce((total, item) => total + (item.price * item.qty), 0);
   // console.log(calcSubTotal);
   // calcSubTotal = calcSubTotal.toFixed(2);
    setCartSubTotal(calcSubTotal);
    const shippingCost = Number(shipping?.amount || 0);
    let calculateDiscount = 0;
    if(coupon?.discount){
      //  console.log("If Coupon",shippingCost);
        calculateDiscount = ((calcSubTotal * coupon.discount) / 100);
        coupon.cartDiscount = calculateDiscount.toFixed(2);
        const calcCartTotal = (calcSubTotal - calculateDiscount) + Number(shippingCost);
        setCartTotal(calcCartTotal.toFixed(2));
    } else
    {
        //console.log("Else: ",shippingCost)
        const calcCartTotal = Number(calcSubTotal) + Number(shippingCost);
        setCartTotal(calcCartTotal.toFixed(2));
        //console.log("Else: ",calcCartTotal)
    }
   //console.log(shipping, calcSubTotal, calcCartTotal);

  }, [cartItems, navigate, coupon, shipping, cartTotal, cartSubTotal, userInfo]);

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d"
        },
        border: "1px solid #ccc",

      },
      invalid: {
        fontFamily: 'Arial, sans-serif',
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };

  const handleStripeChange = async (event) => {   
      setAllowPayment(event.complete);
  };

  const hadleShippingMethod=(ship)=> {
    setShipping(ship);
  }

  const handleCoupon = coupon => {
    setCoupon(coupon);
  }

  return (   
      <main className="container m-auto mt-3">
        <>
          <div className="py-3 text-center  d-block d-sm-none">
            <h1 className="text-center text-danger">Checkout</h1>
          </div>

          <div className="row g-5">
            <div className="col-md-5 col-lg-4 order-md-last">
              {/* Cart Summary Start */}
              <div className="order-summary sticky-top">
                <CartSummary cartItems={cartItems} coupon={coupon} cartSubTotal={cartSubTotal} cartTotal={cartTotal} shipping={shipping} isMobile={isMobile} />
                <Coupon coupon={coupon} handleCoupon={handleCoupon}  />
              </div>
              {/* Cart Summary End */}
            </div>
            <div className="col-md-7 col-lg-8">
              <h3 className="mb-3 text-primary-emphasis">Delivery Address</h3>
              <form className="needs-validation" onSubmit={formik.handleSubmit}>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label htmlFor="firstName" className="form-label">
                      First name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      name="firstName"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                    />

                    { formik.errors.firstName && (
                    <div className="text-danger">
                      {formik.errors.firstName}
                    </div>
                    )}
                  </div>

                  <div className="col-sm-6">
                    <label htmlFor="lastName" className="form-label">
                      Last name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      required=""
                    />

                { formik.errors.lastName && (
                    <div className="text-danger">
                      {formik.errors.lastName}
                    </div>
                )}
                </div>

                  <div className="col-12">
                    <label htmlFor="email" className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      onChange={formik.handleChange}
                      value= {formik.values.email}
                    />
                    { formik.errors.email && (
                    <div className="text-danger">
                      {formik.errors.email}
                    </div>
                    )}
                  </div>

                  <div className="col-12">
                    <label htmlFor="address" className="form-label">
                      Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      onChange={formik.handleChange}
                      value={formik.values.address}
                      required=""
                    />
                    { formik.errors.address && (
                    <div className="text-danger">
                      { formik.errors.address}
                    </div>
                    )}
                  </div>
                
                  <div className="col-md-3">
                    <label htmlFor="city" className="form-label">
                      City <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      name="city"
                      value={formik.values.city}
                      onChange={formik.handleChange}
                      required=""
                    />
                    { formik.errors.city && (
                    <div className="text-danger">
                      {formik.errors.city}
                    </div>
                    )}
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="state" className="form-label">
                      State <span className="text-danger">*</span>
                    </label>
                    <input type="text" 
                      className="form-control"
                      id="state"
                      name="state"
                      value={formik.values.state}
                      onChange={formik.handleChange} />
                    { formik.errors.state && (
                    <div className="text-danger">
                      {formik.errors.state}
                    </div>
                    )}
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="zip" className="form-label">
                      Zip <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="zip"
                      name="zip"
                      value={formik.values.zip}
                      onChange={formik.handleChange}
                    />
                    { formik.errors.zip && (
                    <div className="text-danger">
                      {formik.errors.zip}
                    </div>
                    )}
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="country" className="form-label">
                      Country <span className="text-danger">*</span>
                    </label>
                    <select className="form-select" name="country" id="country" value={formik.values.country} onChange={formik.handleChange}>
                      <option value="">-- Select --</option>                      
                      <option value="AU">Australia</option>
                      <option value="CA">Canada</option>
                      <option value="IN">India</option>
                      <option value="UK">United Kingdom</option>
                      <option value="US">United States</option>
                      <option value="OTHER">Other</option>
                    </select>
                    { formik.errors.country && 
                      <div className="text-danger">
                        Please select a valid country.
                      </div>
                      }
                  </div>
                </div>

                <hr className="my-4" />

                <div className="form-check">
                  <input
                    type="checkbox"
                    name="saveInfo"
                    value="yes"
                    className="form-check-input"
                    id="saveInfo"
                    checked = {formik.values.saveInfo}
                    onChange={formik.handleChange}
                  />
                  <label className="form-check-label" htmlFor="saveInfo">
                    Save this information for next time
                  </label>
                </div>

                <hr className="my-4" />
                <ShippingMethod shippingMethods={shippingMethods} shipping={shipping} hadleShippingMethod={hadleShippingMethod} />

                { checkoutType !== 'stripe' && 
                  <div className="py-3"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "10px",
                      backgroundColor: "#fff",
                    }}
                  >
                      <h4 className="mb-3">Payment Information</h4>
                      <CardElement options={cardStyle} onChange={handleStripeChange} />
                  </div>
                }
             
                { message !== '' && 
                  <p className="text-danger fs-5">{message}</p>
                }
                <div className="mb-3 pt-3 pb-5 mt-3 d-flex justify-content-between">
                <Link to="/cart" className="btn btn-secondary btn-lg" type="button">
                    Back to Cart
                  </Link>

                  <button className="btn btn-danger btn-lg" type="submit"  disabled={!stripe || !allowPayment || submitting}>
                      {submitting ? "Processing..." : `Pay ${formatPrice(cartTotal)}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      </main>
  );
}
