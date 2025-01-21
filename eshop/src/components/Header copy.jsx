import { Link } from "react-router-dom";
import { useAppContext } from "../store/AppProvider";

export function Header() {
  const { state } = useAppContext();
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark"
      aria-label="Offcanvas navbar large"
    >
      <div className="container-xxl bd-gutter flex-wrap flex-lg-nowrap">
        <Link to="/" className="text-decoration-none text-white">
          <span className="fs-1 fw-bolder text-info">DEMO</span>
          <span className="fs-1 fw-lighter fst-italic">STORE</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar2"
          aria-controls="offcanvasNavbar2"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="offcanvas offcanvas-end text-bg-dark"
          tabIndex="-1"
          id="offcanvasNavbar2"
          aria-labelledby="offcanvasNavbar2Label"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbar2Label">
              E.Shop
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                <Link
                  to="/category/all"
                  className="text-white nav-link bi bi-bag"
                >
                  {" "}
                  Shop
                </Link>
              </li>

              <li className="nav-item me-2">
                <Link
                  to="/favorite"
                  className="nav-link text-white  bi bi-heart position-relative"
                >
                  &nbsp; My Wishlists
                  <span className="badge rounded-circle position-absolute top-0 bg-danger text-white small">
                    {state.wishListItems.length}
                  </span>
                </Link>
              </li>

              <li className="nav-item me-2">
                <button
                  className="nav-link text-white  bi bi-cart position-relative"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#cartDrawer"
                >
                  &nbsp; My Cart
                  <span className="badge rounded-circle position-absolute top-0 bg-danger text-white small">
                    {state.cartItems.length}
                  </span>
                </button>
              </li>

              <li className="nav-item">
                <Link
                  to="/myaccount"
                  className="nav-link text-white  bi bi-person-circle"
                >
                  &nbsp; My Account
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
