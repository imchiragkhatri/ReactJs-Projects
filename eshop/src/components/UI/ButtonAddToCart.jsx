import { useState } from "react";
import { useAppContext } from "../../store/AppProvider"
import { ProductCartQty } from "./ProductCartQty";

export function ButtonAddtoCart(props)
{
    const {dispatch, isInCart} = useAppContext();
    const [orderItemId, setOrderItemId] = useState(null);
    const {product,btnClass} = props;

    const handleAddToCart = (item) => {
        setOrderItemId(item.id);
        const itemData = {
            'id': item.id,
            'title': item.title,
            'category': item.category,
            'price': item.price,
            'qty':1,
            'thumbnail': item.thumbnail,
            'image': item.thumbnail
        }
        setTimeout(()=> {
            dispatch({ type: "ADD_TO_CART", payload: itemData });
            setOrderItemId(null);
        }, 1000);
        
    };
    return(
            <>
            {
                isInCart(product.id) ? (
                    <ProductCartQty {...props}  />
                ) :
                <button
                        className={btnClass.normal}
                        onClick={() => handleAddToCart(product)}
                        disabled = {orderItemId === product.id}
                >
                        {orderItemId === product.id ? (
                            <span>
                                <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                                ></span>
                                &nbsp;Adding to Cart
                            </span>
                        ) : (
                            <span className="bi bi-cart4"> Add to Cart</span>
                        )}
                </button>
            }
            </>
    )
    
}