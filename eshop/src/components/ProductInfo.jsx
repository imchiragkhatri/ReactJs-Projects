import { Link } from "react-router-dom";
import StarRating from "./StarRatings";
import { useAppContext } from "../store/AppProvider";
import { useEffect } from "react";
import { ButtonAddtoCart } from "./UI/ButtonAddToCart";
import { ButtonAddToWishList } from "./UI/ButtonAddToWishList";

export function ProductInfo({product,reviewSectionRef}) {

    const { dispatch, formatPrice } = useAppContext();  
    const reviews = product.reviews || []; // Use default empty array
    const totalReviews = reviews.length;
    const scrollToReviews = () => {
        if(reviewSectionRef){
            reviewSectionRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(()=>{
      const itemData = {
          id: product.id,
          title: product.title,
          thumbnail: product.thumbnail,
          image: product.thumbnail,
          price: product.price,
          category: product.category
      };
      dispatch({type:'ADD_TO_HISTORY', payload: itemData});
    },[product, dispatch])

    
  return (
    <>
      <h1 className="d-none d-md-block">{product.title}</h1>
      <div className="d-block">
        <Link to="" onClick={scrollToReviews} className="text-decoration-none">
          <StarRating
            rating={product.rating}
            totalReviews={totalReviews}
            prefix=" ratings"
          />
        </Link>
      </div>
      <p>{product.description}</p>
      <span className="d-block">Brand: {product.brand}</span>
      <span className="d-block">SKU: {product.sku}</span>
      <p>
        Availability:{" "}
        {product.stock > 0
          ? product.stock + " " + product.availabilityStatus
          : "Out of stock"}{" "}
      </p>
      <p>
        Dimension:{" "}
        {product.dimensions
          ? `width: ${product.dimensions.width} x height: ${product.dimensions.height} x depth: ${product.dimensions.depth}`
          : "N/A"}
      </p>
      <p>Weight: {product.weight ? product.weight + "lbs" : ""}</p>
      <p>Warranty: {product.warrantyInformation}</p>
      <p className="fs-3">
        Price: <span className="text-danger fw-bold">{formatPrice(product.price)}</span>
      </p>
      <div className="d-flex my-3">
        <ButtonAddtoCart 
          product={product}
          btnClass={{normal:'btn btn-lg btn-warning', added:'btn py-2 rounded-0 btn-success'}}
          qtyClass = "px-5 py-2 border"
        />

        <ButtonAddToWishList 
            product={product}
            btnClass='btn ms-3 btn-link text-danger'
            iconClass={{normal:'bi bi-heart fs-4', added:'bi bi-heart-fill text-danger fs-4'}}
        /> 
        {/* <button
          className={`btn w-50 btn-lg btn-${
            isInCart(product.id) ? "success" : "warning"
          }`}
          onClick={() => handleAddToCart(product)}
          disabled={isInCart(product.id) ? "disabled" : ""}
        >
          {addingToCart === true ? (
            <span>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              Adding...
            </span>
          ) : isInCart(product.id) ? (
            <span className="bi bi-check-circle-fill"> Added to Cart</span>
          ) : (
            <span className="bi bi-cart4"> Add to Cart</span>
          )}
        </button> 
        <button
          type="button"
          className="btn ms-3"
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
            <span className="bi bi-heart-fill text-danger fs-4"></span>
          ) : (
            <span className="bi bi-heart fs-4"></span>
          )}
        </button>
      */}
      </div> 
      <p className="text-default text-left">
        <span className="me-3">
          <span className="bi bi-truck"></span> {product.shippingInformation}
        </span>
        <span className="bi bi-calendar-check text-uppercase"></span>{" "}
        {product.returnPolicy}
      </p>
    </>
  );
}
