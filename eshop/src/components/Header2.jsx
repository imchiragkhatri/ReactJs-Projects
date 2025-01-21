import { Link, useLocation, useNavigate } from "react-router-dom";
import { Categories } from "./Categories";
import { useAppContext } from "../store/AppProvider";
import { useEffect, useState } from "react";
import axios from "axios";


export function Header2() {
  const { state, dispatch, } = useAppContext();
  const { cartItems, wishListItems,showCartDrawer, isMobile, userInfo } = state;
  const location_arr = useLocation();
  const cartDrawerExclude = ["/cart", "/checkout"];
  const hideCartDrawer = cartDrawerExclude.includes(location_arr.pathname);

  const params = new URLSearchParams(location_arr.search);
  const query = params.get("q") || ""; 
  const [searchTerm, setSearchTerm] = useState(query);
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const toggleCartDrawer=()=> {
    dispatch({type:'TOGGLE_CART_DRAWER', payload:!showCartDrawer});
  }

  const navigate = useNavigate(); 

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);

    if (e.target.value.trim()) {
      setIsDropdownVisible(true);
    } else {
      setIsDropdownVisible(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      // Navigate down
      setHighlightIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      // Navigate up
      setHighlightIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter" && highlightIndex !== -1) {
      // Select highlighted suggestion
      handleSuggestionClick(suggestions[highlightIndex]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.title);
    setIsDropdownVisible(false);
    setHighlightIndex(-1);
  };

  const doLogout = ()=> {
    localStorage.removeItem('userInfo');
    dispatch({type:'USER_SIGN_OUT', payload:null});
    navigate('/');
  }

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim()) {
        try {
          const response = await axios.get(
            `https://dummyjson.com/products/search?q=${searchTerm}`
          );
          setSuggestions(response.data.products || []);
        } catch (error) {
          console.error("Error fetching search suggestions:", error);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounceTimeout = setTimeout(() => fetchSuggestions(), 300); // Debounce API call
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  return (
    <header>
      <div className="main-header">
        <div className="container-fluid d-flex align-items-center justify-content-between py-2">
          <div className="logo">
            <Link to="/" className="text-decoration-none" title="React EShop Demo">
              <img src="/logo.png" alt="ReactEshop" className="logo-image img-fluid" />
            </Link>
          </div>

          <div className="search-box d-none d-lg-block flex-grow-1 mx-4">
            <form className="position-relative" method="get" action="/search" autoComplete="off">
               <input
                type="text"
                name="q"
                className="form-control"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)}
                onFocus={() => searchTerm && setIsDropdownVisible(true)}
                onKeyDown={handleKeyDown} // Handle keyboard events
                autoComplete="false"
              />
              <button type="submit" className="search-icon position-absolute">
                <i className="bi bi-search"></i>
              </button>
              {isDropdownVisible && suggestions.length > 0 && (
                <ul className="dropdown-menu show" style={{ position: "absolute", zIndex: 1000 }}>
                {suggestions.map((product, index) => (
                  <li
                    key={product.id}
                    className={`dropdown-item ${
                      index === highlightIndex ? "active" : ""
                    }`}
                    onClick={() => handleSuggestionClick(product)}
                    onMouseEnter={() => setHighlightIndex(index)} // Highlight on hover
                  >
                    {product.title}
                  </li>
                ))}
              </ul>
              )}
            </form>
          </div>

          <div className="icon-links d-flex">

          <Link to="/about" className="me-2">
              <i
                className="bi bi-journal-code"
                title="About the App"
              ></i>
            </Link>

            <Link to="/favorite" className="me-3 position-relative">
              <i
                className="bi bi-heart"
                data-bs-toggle="tooltip"
                title="Wishlist"
              ></i>
             { wishListItems.length > 0 && 
                <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                  {wishListItems.length}
              </span>
              }
            </Link>

            {hideCartDrawer === false ?
            <Link
              type="button"
              onClick={ toggleCartDrawer}
              className="me-3 position-relative"
            >
             <i
                className="bi bi-cart"
                data-bs-toggle="tooltip"
                title="Cart"
              ></i>
               { cartItems.length > 0 && 
                <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                {cartItems.length}
                </span> 
              }
            </Link>
            :
            <Link
              to="/cart"
              className="me-3 position-relative"
            >
              <i
                className="bi bi-cart"
                data-bs-toggle="tooltip"
                title="Cart"
              ></i>
              <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                {cartItems.length}
              </span>
            </Link>
            }

          { userInfo ?
              <h6 className="dropdown">
              <Link
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {userInfo.picture !=="" ?
                  <span style={{fontSize:'1rem'}}>
                    <img src={userInfo.picture} 
                        alt={userInfo.name}
                        style={{ borderRadius: '50%', maxWidth: '30px', MaxHeight: '30px' }}
                        className="img-fluid"
                        referrerPolicy="no-referrer"
                        />
                  </span>
                :
                <i
                    className="bi bi-person-circle"
                    data-bs-toggle="tooltip"
                    title="Profile"
                  ></i>
                }
              </Link>
              <ul className="dropdown-menu">
                <li              
                    className="dropdown-item"
                  >
                    <Link to="/profile" className="fs-6 text-decoration-none d-block">
                      Profile
                    </Link>
                  </li>
  
                  <li              
                    className="dropdown-item"
                  >
                    <Link to="/orders" className="fs-6 text-decoration-none d-block">
                      Orders
                    </Link>
                  </li>
                  <li              
                    className="dropdown-item d-block"
                  >
                    <Link to={''} className="fs-6 text-decoration-none" onClick={doLogout}>
                      Sign Out
                    </Link>
                  </li>
              </ul>
            </h6>
          :
            <h6 className="dropdown">
              <Link
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
              <i
                  className="bi bi-person-circle"
                  data-bs-toggle="tooltip"
                  title="Profile"
                ></i>
              </Link>
              <ul className="dropdown-menu">
                <li              
                    className="dropdown-item"
                  >
                    <Link to="/signin" className="fs-6 text-decoration-none d-block">
                      Sign In
                    </Link>
                  </li>
              </ul>
            </h6>
          }
           {/*  <Link to="/myaccount" className="me-3">
              <i
                className="bi bi-person-circle"
                data-bs-toggle="tooltip"
                title="Profile"
              ></i>
            </Link> */}
          </div>

          {isMobile &&   <button
            className="navbar-toggler fs-1 ms-1"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileMenu"
            aria-controls="mobileMenu"
          >
            <i className="bi bi-list"></i>
          </button>
          }
        </div>
      </div>

      <div className="mobile-search d-lg-none py-2 px-3">
        <form className="position-relative" method="get" action="/search" autoComplete="off">
          <input
            name="q"
            type="text"
            className="form-control"
            placeholder="Search products..."
          />
          <button type="submit" className="search-icon position-absolute">
            <i className="bi bi-search"></i>
          </button>
        </form>
      </div>

      {isMobile &&  <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="mobileMenu"
        aria-labelledby="mobileMenuLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title text-danger fs-4" id="mobileMenuLabel">
            Menu
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <Categories navClass="mobile-menu" />
        </div>
      </div>
      }

      {!isMobile && 
        <nav className="navbar navbar-expand-lg top-strip">
          <div className="container-fluid">
            <div className="collapse navbar-collapse align-items-center justify-content-center" id="navbarNav">
              <Categories navClass="menu" />
            </div>
          </div>
        </nav>
      }
    </header>
  );
}
