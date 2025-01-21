import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAppContext } from "../store/AppProvider";

const CheckoutSuccess = () => {
  const [sessionDetails, setSessionDetails] = useState(null);
  const {dispatch} = useAppContext();
  const [orderId, setOrderId] = useState(null);
  const queryParams = new URLSearchParams(window.location.search);
  const sessionId = encodeURIComponent(queryParams.get("session_id"));
  //console.log("CHK URL: ",process.env.REACT_APP_STRIPE_RETRIEVE_SESSION_URL);
  useEffect(() => {
    if (sessionId) {
      //console.log(`${process.env.REACT_APP_STRIPE_RETRIEVE_SESSION_URL}?session_id=${sessionId }`);
     // const data = {'session_id': sessionId};
      axios
        .get(`${process.env.REACT_APP_STRIPE_RETRIEVE_SESSION_URL}?session_id=${sessionId}`)
        .then((response) => {
          setSessionDetails(response.data);
         // console.log("Response:",response.data);
          const prevOrder = JSON.parse(localStorage.getItem('lastOrder'));
          const orders = JSON.parse(localStorage.getItem("orders")) || [];
          if(prevOrder){
            console.log("Order saved...!", prevOrder.orderNumber);
            let getOrderNo = prevOrder.orderNumber?prevOrder.orderNumber:response.data.metadata.order_id;
            setOrderId(getOrderNo);
            const updatedOrder = [prevOrder,...orders];
            localStorage.setItem('orders', JSON.stringify(updatedOrder));
            localStorage.removeItem('lastOrder');
            dispatch({type:'CLEAR_CART',payload:[]});
          }

        })
        .catch((error) => {
          console.error("Error retrieving session details:", error);
        }); 
       
    }
  }, [dispatch, sessionId]);

  if (!sessionDetails) {
    return <div className="d-flex justify-content-center align-items-center min-vh-100">
    <p className="fs-5"><span className="spinner-border text-dark align-middle my-3" role="status"></span> Please wait while getting your order status...</p></div>;
  }

  return (
    <div className="container-fluid">
        <div className="row m-auto text-center my-3">
            <div className="col row row-cols-1 row-cols-md-3 mt-5  text-center">
            <div className="card mb-4 rounded-3 border border-success shadow-sm m-auto">
                <div className="card-header bg-light">
                    <h2 className="fw-normal text-success">Payment Successful!</h2>
                </div>
                <div className="card-body">
                    <p>Thank you for your order, {sessionDetails.customer_details.name}!</p>
                    <h4 className="card-title pricing-card-title py-5">Order ID: {orderId}</h4>
                    <p>Payment Ref. Id: {sessionDetails.id}</p>
                    <Link to="/orders" type="button" className="w-100 btn btn-lg btn-outline-success mt-3">My Orders <i className="bi bi-arrow-right"></i></Link>
                </div>
            </div>
        </div>
           
        </div>
    </div>
  );
};

export default CheckoutSuccess;

/* 
{
  "id":"cs_test_b12MCQIFPdWd2WGHTeW08dRI1ISasm1VSmtYuqatlTRZns69PklyEgNaps",
"object":"checkout.session",
"adaptive_pricing":{"enabled":false},
"after_expiration":null,
"allow_promotion_codes":null,
"amount_subtotal":117998,
"amount_total":94398,
"automatic_tax":{"enabled":false,"liability":null,"status":null},
"billing_address_collection":null,
"cancel_url":"http://localhost:3000/checkout",
"client_reference_id":null,
"client_secret":null,
"consent":null,
"consent_collection":null,
"created":1732638863,
"currency":"usd",
"currency_conversion":null,
"custom_fields":[],
"custom_text":{"after_submit":null,"shipping_address":null,"submit":null,"terms_of_service_acceptance":null},
"customer":null,
"customer_creation":"if_required",
"customer_details":
    {
        "address":
            {
                "city":null,
                "country":"IN",
                "line1":null,
                "line2":null,
                "postal_code":null,
                "state":null
            },
        "email":"chirag.khatri@gmail.com",
        "name":"Chirag Khatri",
        "phone":null,
        "tax_exempt":"none","tax_ids":[]},
        "customer_email":"chirag.khatri@gmail.com",
        "expires_at":1732725263,
        "invoice":null,
        "invoice_creation":
        {
            "enabled":false,
            "invoice_data":
                {
                    "account_tax_ids":null,
                    "custom_fields":null,
                    "description":null,
                    "footer":null,
                    "issuer":null,
                    "metadata":{},
                    "ren  dering_options":null
                }
        },
        "livemode":false,
        "locale":null,
            "metadata":{
                "coupon_code":"SAVE20",
                "customer_name":"Chirag Khatri",
                "discount":"236",
                "order_id":"1732638860329"
            },
        "mode":"payment",
        "payment_intent":"pi_3QPRjWGGtNp1QEZW0rcWnsbI",
        "payment_link":null,
        "payment_method_collection":"if_required",
        "payment_method_configuration_details":null,
        "payment_method_options":{"card":{"request_three_d_secure":"automatic"}},
        "payment_method_types":["card"],
        "payment_status":"paid",
        "phone_number_collection":{"enabled":false},"recovered_from":null,
        "saved_payment_method_options":null,
        "setup_intent":null,
        "shipping_address_collection":null,
        "shipping_cost":null,
        "shipping_details":null,
        "shipping_options":[],
        "status":"complete",
        "submit_type":null,
        "subscription":null,
        "success_url":"http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}&ref=1732638860329",
        "total_details":{"amount_discount":23600,"amount_shipping":0,"amount_tax":0},"ui_mode":"hosted","url":null}
*/
