import { useRef, useState } from "react";
import { Link } from "react-router-dom";

export function Coupon(props){
    const validCoupons = [
        { code: "SAVE10", discount: 10 },
        { code: "SAVE20", discount: 20 },
        { code: "SAVE25", discount: 25 },
        { code: "END2024", discount: 24 },
        { code: "LUCKY", discount: 15 },
      ];
    const [couponMessage, setCouponMessage] = useState("");
    const {coupon, handleCoupon} = props;
    const couponRef = useRef();
    const fillCouponCode = (c)=> {
        couponRef.current.value = c.toUpperCase();
      }
    const handleCouponeApply = () => {
        const inputCoupon = couponRef.current.value;
        const getCoupon = validCoupons.find( (c) => c.code === inputCoupon.toUpperCase());
    
        if (getCoupon) {
          setCouponMessage("");
          handleCoupon(getCoupon);
        } else {
          setCouponMessage("Invalid or expired coupon code.");
        }
          
      };
    
    const handleCouponeDelete = () => {
        setCouponMessage("");
        handleCoupon([]);
        couponRef.current.value = '';
    };

    return(
        <form className="card p-2">
        {!coupon.code && (
          <h6 className="dropdown">
            <Link
              className="nav-link dropdown-toggle"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
             Have a Coupon?
            </Link>
            <ul className="dropdown-menu">
              {validCoupons.map((c) => (
                <li
                  key={c.code}
                  className="dropdown-item"
                  onClick={() => fillCouponCode(c.code)}
                >
                  {" "}
                  {c.code}
                </li>
              ))}
            </ul>
          </h6>
        )}
        <div className="input-group">
          <input
            type="text"
            ref={couponRef}
            name="coupon"
            className="form-control text-uppercase"
            readOnly={coupon.code ? "readonly" : ""}
            defaultValue={coupon.code || ""}
          />
          {coupon.code ? (
            <button
              type="button"
              className="btn btn-danger bi bi-x"
              onClick={handleCouponeDelete}
            >
              &nbsp;
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-dark"
              onClick={handleCouponeApply}
            >
              Apply
            </button>
          )}
        </div>
        {couponMessage !== "" && <p className="text-danger">{couponMessage}</p>}
      </form>
    )
}