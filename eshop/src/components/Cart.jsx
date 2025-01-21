import { Link } from "react-router-dom";
import { useAppContext } from "../store/AppProvider";
import { ProductCartQty } from "./UI/ProductCartQty";
import '../components/Cart/cart.css'

export function Cart(props){
    const {state, formatPrice} = useAppContext();
    const {cartItems, userInfo} = state;
    const cartSubTotal = cartItems.reduce((total, item) => total + (item.price*item.qty), 0);
    return(
        <div className="container-fluid">
            <div className="container">
                <div className="py-3 text-center  d-block d-sm-none">
                    <h1 className="text-center my-5">Shopping Cart</h1>
                </div>

                <div className="m-auto">
                    {cartItems.length > 0 ? (
                        <>
                        <div className="container my-5">
                        <div className="row cart-header">
                            <div className="col-2 d-none d-md-block">Item</div>
                            <div className="col-6 col-md-4">Title</div>
                            <div className="col-2 d-none d-md-block text-center">Price</div>
                            <div className="col-2 d-none d-md-block">Quantity</div>
                            <div className="col-2 d-none d-md-block text-end">Total</div>
                        </div>
                                {cartItems.map((item, index) => (
                                    <div className="cart-item" key={`${item.id}${index}`}>
                                        <div className="row align-items-center">
                                            <div className="col-4 col-md-2">
                                                <img src={item.thumbnail} width="150" alt={item.title} className="img-fluid" />
                                            </div>

                                            <div className="col-8 col-md-4">
                                                <div className="fw-normal">{item.title}</div>
                                                <div className="text-muted">{formatPrice(item.price)}  x {item.qty}</div>
                                            </div>

                                            <div className="col-2 text-center d-none d-md-block">{formatPrice(item.price)}</div>
                                            <div className="col-6 col-md-2 text-start text-md-center item-qty">
                                                <ProductCartQty product={item} 
                                                btnClass={{normal:'btn btn-warning', added:'btn py-1 rounded-0 btn-success'}}
                                                qtyClass = "px-4 py-1 border"
                                                /></div>
                                            <div className="col-6 col-md-2 text-end">{formatPrice(item.price * item.qty)}</div>

                                        </div>
                                    </div>
                                    )
                                    )
                                }
                                <div className="row mt-2 pb-2"  style={{borderBottom:'3px double #ddd'}}>
                                    <div className="col text-end cart-total"><span className="d-inline-block me-4">Total: </span>{formatPrice(cartSubTotal)}</div>
                                </div>
                                <div className="row mt-3 action-buttons">
                                    <div className="d-flex justify-content-between my-5">
                                        <Link to="/all" className="btn btn-secondary btn-lg" type="button"><i className="bi bi-arrow-left"></i>
                    Keep Shopping </Link>
                                    {userInfo && userInfo !== null ?
                                        <Link to="/checkout" className="btn btn-danger btn-lg">Checkout <i className="bi bi-arrow-right"></i></Link>
                                      :
                                        <Link to="/signin?ref=checkout" className="btn btn-danger btn-lg">Checkout <i className="bi bi-arrow-right"></i></Link>
                                    }
                                        </div>
                                </div>
                            </div>

                       {/*  <table className="table table-bordered w-100 table-light mt-4 ">
                          
                            <tbody>
                                {cartItems.map((item) => (
                                    <tr key={item.id}>                                       
                                        <td className="text-center"><img src={item.thumbnail} height="50" alt={item.title} /></td>
                                        <td>{item.title}</td>
                                        <td className="text-end pe-2">{formatPrice(item.price)}</td>
                                        <td><ProductCartQty product={item} btnClass= /></td>
                                        <td className="text-center align-middle" ><span type="button" style={{width:'20px'}} className="bi bi-trash3" onClick={()=> {  dispatch({type:'REMOVE_FROM_CART', payload:item.id}); }}></span>
                                        </td>
                                        
                                    </tr>    
                                ))}
                            
                            </tbody>
                            <tfoot>
                                <tr className="text-bg-warning py-3">
                                    <td colSpan={3} className="text-end fs-4 pe-2">Total:</td>
                                    <td className="text-end fs-4 pe-2">{formatPrice(cartSubTotal)}</td>
                                </tr></tfoot>
                           </table> */}

                           
                           </>
                    ) : (
                        <>
                        <p className="text-center py-5 fs-3">Your cart is empty. 
                        <br />
                        <Link to="/all" className="btn btn-primary my-3 fs-5">Continue Shopping</Link></p>
                        </>
                    )}
                </div>
            </div>
            
        </div>
    )
}