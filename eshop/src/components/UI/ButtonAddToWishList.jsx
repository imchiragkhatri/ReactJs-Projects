import { useState } from "react";
import { useAppContext } from "../../store/AppProvider"

export function ButtonAddToWishList(props){
    const {isInWishlist, dispatch} = useAppContext();
    //const [wishListItemId, setWishListItemId] = useState(null);
    const [addingToWishlist, setAddingToWishlist] = useState(false);
    const {product, btnClass, iconClass} = props;

    const handleAddToWishList = (item) => {
        setAddingToWishlist(true);
        if(isInWishlist(item.id))
        {
            dispatch({type:'REMOVE_FROM_WISHLIST', payload:item.id});
            setTimeout(()=> {
                dispatch({type:'REMOVE_FROM_WISHLIST', payload:item.id});
                setAddingToWishlist(false);
            }, 1000);
        }
        else
        {
            const itemData = {
                id: item.id,
                title: item.title,
                thumbnail: item.thumbnail,
                image: item.thumbnail,
                images: item.images||[],
                price: item.price,
                rating: item.rating
            };
            setTimeout(()=> {
                dispatch({type:'ADD_TO_WISHLIST', payload: itemData});
                setAddingToWishlist(false);
            }, 1000);
           
        }
        
    }

    return(
        <button
                type="button"
                className={btnClass}
                onClick={() => handleAddToWishList(product)}
            >
                {addingToWishlist === true ? (
                <span>
                    <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                    ></span>
                </span>
                ) : isInWishlist(product.id) ? (
                <i className={iconClass.added}></i>
                ) : (
                <i className={iconClass.normal}></i>
                )}
            </button>
    )
}

