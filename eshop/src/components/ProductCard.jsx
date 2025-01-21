import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../store/AppProvider";
import StarRating from "./StarRatings";
import { ButtonAddtoCart } from "./UI/ButtonAddToCart";
import { ButtonAddToWishList } from "./UI/ButtonAddToWishList";
import { ThumbImage } from "./UI/ThumbImage";

export function ProductCard(props) {
    const { catid } = useParams();
    const { formatPrice } = useAppContext();
    const {openQuickView, product, hideQuickView} = props;
    return (
        <div className="product-card position-relative">
            {!hideQuickView && 
                <div className="quick-view text-center">
                <button
                    className="btn btn-outline-success"
                    type="button"
                    onClick={() => openQuickView(product)}
                >
                    <i className="bi bi-eye-fill"></i> Quick View
                </button>
                </div>
            }
            <Link to={`/${catid || "favorite"}/${product.id}`}>
                <ThumbImage image={product.thumbnail}  title={product.title} imgClass="card-img-top img-fluid" />        
            </Link>
            <h3 className="product-name text-center">
            <Link
                to={`/${catid || "product"}/${product.id}`}
                className="text-decoration-none"
            >
                {product.title}
            </Link>
            </h3>
            <div className="card-body d-flex justify-content-between flex-md-row flex-column">
            <span className="text-center">
                <dl>
                <dt>Price:</dt>
                <dd>{formatPrice(product.price)}</dd>
                </dl>
            </span>
            <span className="text-center">
                <dl>
                <dt>Rating</dt>
                <dd>
                    <StarRating
                        rating={product.rating}
                        totalReviews={product.reviews?.length || 0}
                        prefix=""
                    />
                </dd>
                </dl>
            </span>
            </div>
            <div className="product-options">
                <ButtonAddtoCart 
                    product={product}
                    btnClass={{normal:'btn btn-warning', added:'btn py-1 rounded-0 btn-success'}}
                    qtyClass = "px-5 py-1 border"
                />
                <ButtonAddToWishList 
                    product={product}
                    iconClass={{normal:'bi bi-heart text-danger', added:'bi bi-heart-fill text-danger'}}
                    btnClass="wishlist-btn"
                /> 
            </div>
           {/*  {
                showQuickView && 
                <QuickProductView
                    product={quickViewProduct} 
                    showModal={showQuickView} 
                    onClose={closeQUickView} />
            } */}
        </div>
    );
}
