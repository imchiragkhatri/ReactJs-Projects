import { useEffect, useState } from "react";
import { useAppContext } from "../store/AppProvider";

export function CartSummary(props) {
    const {cartItems, cartSubTotal, cartTotal, shipping, coupon, isMobile} = props;
    const {formatPrice} = useAppContext();
    const[hideCartSummary, setHideCartSummary] = useState(isMobile);

    useEffect(()=> {
      setHideCartSummary(isMobile)
    }, [isMobile])
   // console.log("Summary: ",props);
  return (
    <>
      <h4 className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-primary-emphasis" data-ismobile={isMobile} data-summary={hideCartSummary}>
          { isMobile=== true ? 
            <span onClick={()=> setHideCartSummary(!hideCartSummary)} style={{cursor:'pointer'}}><i className={hideCartSummary===true?'bi bi-plus':'bi bi-dash'}></i> Order Summary</span>
            : 'Order Summary'
          } 
        </span>
        <span className="badge bg-secondary rounded-pill fs-6">
          {cartItems.length} {cartItems.length === 1 ? " item" : " items"}
        </span>
      </h4>
      <ul className={`list-group mb-3 ${hideCartSummary===true?'d-none':''}`}>
        {cartItems.length > 0 &&
          cartItems.map((item, index) => (           
            <li
              key={item.id}
              className="list-group-item d-flex justify-content-between lh-sm"
            >
              <div>
                <h6 className="my-0">
                  {item.title} <small className="text-muted">({item.qty} x {formatPrice(item.price)})</small>
                </h6>
              </div>
              <span className="">{formatPrice(item.price*item.qty)}</span>
            </li>
          ))}

        <li className="list-group-item d-flex justify-content-between">
          <strong>Sub Total:</strong>
          <strong>{formatPrice(cartSubTotal)}</strong>
        </li>

        {coupon.cartDiscount && (
          <li className="list-group-item d-flex justify-content-between bg-body-tertiary">
            <div className="text-success">
              <h6 className="my-0">Discount:</h6>
            </div>
            <span className="text-success  fw-bold">
              -{formatPrice(coupon.cartDiscount)}
            </span>
          </li>
        )}

        <li className="list-group-item d-flex justify-content-between">
          <span>Shipping:</span>
          <strong>{shipping.amount > 0 ? formatPrice(shipping.amount): 'FREE'}</strong>
        </li>
        <li className="list-group-item d-flex justify-content-between bg-success text-white">
          <strong>Total:</strong>
          <strong>{formatPrice(cartTotal)}</strong>
        </li>
      </ul>
    </>
  );
}
