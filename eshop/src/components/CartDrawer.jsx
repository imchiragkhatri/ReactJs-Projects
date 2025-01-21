import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../store/AppProvider";
import { ProductCartQty } from "./UI/ProductCartQty";

export function CartDrawer(){
    const {state, dispatch, formatPrice } = useAppContext();
    const {cartItems, showCartDrawer} = state;
    const location = useLocation();
    const cartDrawerExclude = ["/cart", "/checkout"];
    const hideCartDrawer = cartDrawerExclude.includes(location.pathname);
    var cartTotal = cartItems.reduce((total, item) => total + (item.price * item.qty),0);
    const handleRemoveItem=(id)=> {
       dispatch({type:'REMOVE_FROM_CART', payload:id});
    }

    const closeDrawer = ()=> {
      dispatch({type:'TOGGLE_CART_DRAWER', payload:false});
    }

    if(hideCartDrawer === true && showCartDrawer === false) { return  }

    return (
      <>
      <div
        className={`offcanvas offcanvas-end ${ showCartDrawer===true ? 'show' : ''}`}
        tabIndex="-1"
        id="cartDrawer"
        
      >
        <div className="offcanvas-header border border-bottom">
          <h4 id="cartDrawerLabel">Your Cart <span className="bi bi-cart3 d-inline-block"></span></h4>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            data-bs-dismiss="offcanvas"
            onClick={closeDrawer}
          ></button>
        </div>
        <div className="offcanvas-body">
          {cartItems.length > 0 ? (
            <ul className="list-group">
              {cartItems.map((item) => (
                <li className="list-group-item d-flex justify-content-between align-items-center py-2 px-1" key={item.id}>                  
                  <span className="me-2" style={{width:'70px'}}><img src={item.thumbnail} width="65" alt={item.title} /></span>
                  <span style={{textAlign:'left', width:'100%'}}>
                    {item.title} <br />
                    <small className="pb-3 d-block">{formatPrice(item.price)} x {item.qty}</small>
                     <ProductCartQty
                        product={item}
                        btnClass={{normal:'btn btn-warning', added:'btn py-1 rounded-0 btn-success'}}
                        qtyClass = "px-4 py-1 border"/>
                  </span>
                  <span className="text-end" style={{width:'130px'}}>
                    <button 
                        type="button"
                        className="bi btn bi-trash3 text-end"
                        onClick={()=> { handleRemoveItem(item.id);}}>
                      </button>
                    {formatPrice(item.price * item.qty)}
                    </span>
                </li>
              ))}
             

             {/*  <li className="d-flex justify-content-between py-3 text-align-center"  aria-label="Close"
          data-bs-dismiss="offcanvas">
                <Link className="btn text-center btn-success m-auto" to="/cart" onClick={closeDrawer}> Go to Cart <span className="bi bi-arrow-right d-inline-block"></span></Link>
              </li> */}
          </ul>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
        { cartItems.length > 0 &&
          <div className="offcanvas-footer">
             <div className="d-flex justify-content-between text-bg-warning px-3 py-2">
                <span><strong>Total:</strong></span>
                <span><strong>{formatPrice(cartTotal)}</strong></span>
              </div>
              <div className="text-center my-2">
                <Link className="btn text-center btn-danger m-auto" to="/cart" onClick={closeDrawer}> Go to Cart <span className="bi bi-arrow-right d-inline-block"></span></Link>
              </div>
          </div>
          }
      </div>
      {showCartDrawer && <div className="offcanvas-backdrop fade show" title="Click to close the Cart Drawer" onClick={closeDrawer}></div>}
      </>
    );
  };
  