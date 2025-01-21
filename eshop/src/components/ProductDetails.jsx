import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { useAppContext } from "../store/AppProvider";
import { ProductImages } from "./ProductImages";
import { ProductInfo } from "./ProductInfo";
import { NotFound } from "./Pages/NotFound";

export function ProductDetails(){
    const {state } = useAppContext();
    const[product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    
    const {categories} = state;
    let {catid, pid} = useParams();
    catid = catid==="product"?product.category:catid;
    const [catPath, setCatPath] = useState([]);
    
    const reviewSectionRef = useRef(null);

    const formatDate=(isoDate)=> {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }
  
    useEffect(()=> {
        const getProductInfo = async() => {
            setLoading(true);
            await axios.get(`https://dummyjson.com/products/${pid}`)
            .then(response => {
                const productData = response.data;
                setProduct(productData);
                setLoading(false);
                setIsError(false);
            })
            .catch(error => {
                console.log(error.status);
                setIsError(true);
            });
        }
        getProductInfo();
    },[pid]);

    useEffect(()=> {
        if(product && isError===false){           
            const getPath = categories.find((cat) =>  cat.slug === catid);
            if(getPath){
                setCatPath(getPath);
                document.title =  product.title ? `${product.title} | ${getPath.name}` : 'Loading...';
            }
        }
       
     },[catid, isError, product, categories, pid]);

    if (Object.keys(product).length === 0 && loading === true && isError===false) {
        return <div className="d-flex justify-content-center align-items-center min-vh-100">
                    <p className="fs-5"><span className="spinner-border text-dark align-middle" role="status"></span> Loading...</p>
                </div>
    }

    if(isError){
        return (
            <NotFound />
        )
    }
    
    return(
        <div className="container-fluid">
        <div className="row m-auto pt-3 pb-5">
        <h1 className="d-block d-sm-none text-center">{product.title}</h1>
            {catPath &&
            <div className="d-none d-md-block">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                           <li className="breadcrumb-item">
                            <Link to="/">Home</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            <Link to={`/${catPath.slug}`}>{catPath.name}</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">{product.title}</li>
                        
                    </ol>
                </nav>
                <hr />
            </div>
            }
            <div className="col-md-6 col-12 col text-center">
                <ProductImages images={product.images}  thumbSize={{width:125, height:125}} title={product.title} />
            </div>
            <div className="col-md-6 col-12 sticky pb-5 product-info-section">
                <ProductInfo product={product} reviewSectionRef={reviewSectionRef}  />
            </div>
        </div>
        { product.reviews &&
                <div className="row mb-5">
                <h3 className="text-center my-3 fs-2" ref={reviewSectionRef}>Reviews</h3>
                {
                    product.reviews.map((review, index)=>
                        <div key={index} className="col-md-4 col-12 mb-2">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{review.reviewerName} &nbsp; <small>{ review.rating} <span className="bi bi-star-fill text-warning"></span></small></h5>
                                    <p className="card-text fst-italic">{ review.comment }</p>
                                    <p>Posted on: {formatDate(review.date)}</p>
                                </div>
                            </div>
                        </div>
                    )
                    }
            </div>
        }
        </div>
    )
}