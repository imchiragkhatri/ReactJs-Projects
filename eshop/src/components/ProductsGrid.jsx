import { Link } from "react-router-dom";
import { useAppContext } from "../store/AppProvider";
import { ThumbImage } from "./UI/ThumbImage";

export function ProductsGrid(props) {
    const {formatPrice} = useAppContext();
    const {title, prefix, products, url, loading} = props;
  return (
    <div className="row custom-row" key={title}>
        <div className="d-flex justify-content-between align-items-center">
        <h3 className="text-start py-3">{prefix!=='' ? <span className="text-danger fw-semibold">{prefix}</span>:''} {title} </h3>
        {url !=='' && 
            <Link to={url} className="d-inline-block float-end fs-5 text-decoration-none text-dark icon-arrow-right">View all <i className="bi bi-arrow-right"></i></Link>
        }
        </div>

        {loading === true ?
            [1,2,3,4].map((item,index) => (
                <div className="col-md-3 col-6" key={`placeholder_${item}-${index}`}>
                    <div className="card">
                            <div className="card-body placeholder-glow">
                                <p className="placeholder col-12" style={{padding:'6rem 0'}}></p>
                            </div>
                            <div className="card-body placeholder-glow">
                                <h5 className="card-title placeholder col-12">&nbsp;</h5>
                                <p className="card-text placeholder col-4 text-center"></p>
                            </div>
                        </div>
                    </div>
                ))
        :

         products.map((product) => (
            <div className="col-md-3 col-6" key={`${product.id}-${url}`}>
                <Link to={`/${url || "product"}/${product.id}`} className="text-decoration-none">
                    <div className="card">
                        <ThumbImage image={product.thumbnail} title={product.title} imgClass='card-img-top' />                     
                        <div className="card-body">
                            <h6 className="card-title text-truncate">{product.title}</h6>
                            <p className="card-text">{formatPrice(product.price)}</p>
                        </div>
                    </div>
                </Link>
            </div>
            ))
        }
    </div>
  );
}
