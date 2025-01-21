import { Link } from "react-router-dom";

export function HeaderCheckout(props) {

  return (
    <header>
      <div className="main-header">
        <div className="container-fluid d-flex align-items-center justify-content-between py-2">
          <div className="logo">
            <Link to="/" className="text-decoration-none"  title="React EShop Demo">
              <img src="/logo.png" alt="ReactEshop" className="logo-image img-fluid" />
            </Link>
          </div>

          <div className="">
            <h2>
                <i className="bi bi-lock-fill text-warning" title="Secure Checkout"></i> 
                <span className="d-none d-md-inline-block d-lg-inline-block"> {props.title}</span></h2>
          </div>

          <div className="icon-links d-flex">
            <Link
              to="/cart"
              className="me-3 ms-4 position-relative"
            >
              <i
                className="bi bi-cart"
                data-bs-toggle="tooltip"
                title="Cart"
              ></i>
             
            </Link>
          </div>

        </div>
      </div>

    </header>
  );
}
