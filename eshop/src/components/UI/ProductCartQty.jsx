import { useAppContext } from "../../store/AppProvider";


export function ProductCartQty(props){
    const {product, btnClass, qtyClass} = props;
    const {dispatch, getCartQty} = useAppContext();
    const cartQty = getCartQty(product.id);
    return(
        <div className="d-flex align-items-center">
            {
                (cartQty === 1) ? (
                <button className={btnClass.added} onClick={()=> dispatch({ type: "REMOVE_FROM_CART", payload: product.id })}>
                    <i className="bi bi-trash"></i>
                </button>
                ) : (
                <button className={btnClass.added}  onClick={()=> dispatch({ type: "DECREASE_QTY", payload: product.id })}>
                    <i className="bi bi-dash-lg"></i>
                </button>
                )
            }
            <span className={qtyClass}>{ cartQty }</span>

            <button className={btnClass.added} onClick={()=> dispatch({ type: "INCREASE_QTY", payload: product.id })}>
                <i className="bi bi-plus-lg"></i>
            </button>
        </div>
    )
}