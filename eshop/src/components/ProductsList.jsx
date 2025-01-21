import "../../src/productList.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../store/AppProvider";
import QuickProductView from "./QuickProductView";
import { NotFound } from "./Pages/NotFound";
import { ProductCard } from "./ProductCard";

export function ProductsList() {
  const { catid } = useParams();
  const { state } = useAppContext();
  const { wishListItems, categories } = state;
  const [ currentCategory, setCurrentCategory] = useState([]);
  const [orgProducts, setOrgProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [showQuickView, setShowQuickView] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isError, setIsError] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [sortIcon, setSortIcon] = useState(null);
  const [isSorting, setIsSorting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const getPriceRange = params.get("price-range") || "";
  const getRating =  params.get("ratings") || "";
  const getSortBy = params.get("sortby") || '';
  const currentPage = location.pathname;
  const closeQUickView = () => {
    setShowQuickView(false);
    setQuickViewProduct(null);
  };

  const openQuickView = (product) => {
    setQuickViewProduct(product);
    setShowQuickView(true);
  };

  //  const location = useLocation();
  // console.log("Location: ", location);
  function loadProducts(url, signal) {
    setLoading(true);
    axios
      .get(url, { signal })
      .then((response) => {
        const prodData = response.data.products;
        setOrgProducts(prodData);
        setProducts(prodData);
        setLoading(false);
        setIsError(false);
       // console.log("Data", response.data);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request cancelled!", error.message);
        } else {
          console.log(error);
          setIsError(true);
        }
        setLoading(false);
      });
  }

  useEffect(()=> {
    if(currentPage === "/favorite")
    {
      setCurrentCategory({name:"My Favorites", slug:"favorite"});
    } else {
      const getCatInfo = categories.find((cat) =>  cat.slug === catid);
      if(getCatInfo){
          setCurrentCategory(getCatInfo);
      }
    }    
  },[currentPage, categories, catid]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if(currentPage !== "/favorite")
    {
        if (!catid || catid === "all") {
          loadProducts("https://dummyjson.com/products?limit=30", signal);
          document.title = "All Products - Demo Store by Chirag Khatri";
        } else {
          loadProducts(`https://dummyjson.com/products/category/${catid}`, signal);
          document.title = currentCategory?.name
            ? currentCategory.name + " - Demo Store by Chirag Khatri"
            : "Demo Store by Chirag Khatri";
        }
    }
  }, [currentPage, catid, currentCategory]);

  useEffect(()=>{
    if (currentPage === "/favorite") {
      setProducts(wishListItems);
      setLoading(false);
      document.title = "My Favorites - Demo Store by Chirag Khatri";
    } 
  },[wishListItems,currentPage])

  const sortProducts = useCallback((sortBy, sortedProducts) => {
    //const orgProducts = [...products];
    switch(sortBy){
      case 'name-asc':
        return sortedProducts.sort((a,b)=> a.title.localeCompare(b.title));
      case 'name-desc':
        return sortedProducts.sort((a,b)=> b.title.localeCompare(a.title));
      case 'price-high':
        return sortedProducts.sort((a,b)=> b.price - a.price);
      case 'price-low':
        return sortedProducts.sort((a,b)=> a.price - b.price);
      case 'rating-high':
        return sortedProducts.sort((a,b)=> b.rating - a.rating);
      case 'rating-low':
        return sortedProducts.sort((a,b)=> a.rating - b.rating);
      default:
        return sortedProducts;
    }
  },[]);

  useEffect(()=> {
      if((getPriceRange !== '' || getRating !=='' || getSortBy !== '') && orgProducts?.length > 0){
        const price_arr = getPriceRange.split('-');
        let start = price_arr[0];
        let end = price_arr[1] || 0;
        let filterdProducts = [];

        if(getPriceRange !=='' && getRating !=='')
        {
          if(end === 0)
          {
            filterdProducts = orgProducts.filter((product) => product.price >= start && product.rating >= getRating);
          }
          else
          {
            filterdProducts = orgProducts.filter((product) => product.price >= start && product.price < end  && product.rating >= getRating);
          }
        }
        else if(getRating !== ''){
          filterdProducts = orgProducts.filter((product) => product.rating >= getRating);
        }
        else
        {       
          if(end === 0)
          {
            filterdProducts = orgProducts.filter((product) => product.price >= start);
          }
          else
          {
            filterdProducts = orgProducts.filter((product) => product.price >= start && product.price < end);
          }
        }

        if(getSortBy !==''){          
          filterdProducts = sortProducts(getSortBy,filterdProducts);
        }

        setProducts(filterdProducts);
    }
    else
    {
      setProducts(orgProducts);
    }
  }, [getPriceRange, getRating, getSortBy, orgProducts, sortProducts]);

  if(isError=== true && isLoading === false && orgProducts.length === 0){
    return (
        <NotFound />
    )
  }

  

  const handleSortBy=(sortVal)=>{
    setIsSorting(true);
    setSortBy(sortVal);
    if(sortVal === '')
    {
        setSortIcon('');
        const searchParams = new URLSearchParams(location.search);
        searchParams.delete('sortby');

        navigate({
            pathname: location.pathname,
            search: searchParams.toString(),
        });
    }
    else {      
      switch(sortVal){
        case 'name-asc':
          setSortIcon('bi-sort-alpha-up');
          break;
        case 'name-desc':
          setSortIcon('bi-sort-alpha-down-alt');
          break;
        case 'price-high':
          setSortIcon('bi-sort-numeric-down-alt');
          break;
        case 'price-low':
          setSortIcon('bi-sort-numeric-down');
          break;
        case 'rating-high':
          setSortIcon('bi-sort-down');
          break;
        case 'rating-low':
          setSortIcon('bi-sort-down-alt');
          break;
        default:
          setSortIcon('');
      }
      
     
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('sortby', sortVal);

      navigate({
          pathname: location.pathname,
          search: searchParams.toString(),
      });
      sortProducts(sortVal, products);
      setTimeout(()=> {setIsSorting(false)}, 500);
      
    }
  }

  return (
    <div className="container-fluid"> 
      <div className="row">
        {orgProducts?.length > 0 &&
            <div className="col-2 col-md-2 d-none d-md-block border-end">
                  <Sidebar orgProducts={orgProducts} getPriceRange={getPriceRange.trim()} getRating={getRating} />
            </div>
        }
        <div className="col-12 col-md-10 min-vh-100 m-auto">
            <div className="row">
                <div className="col"> <h1 className="my-5 text-center">{currentCategory.name}</h1></div>
                {products?.length > 2 &&
                  <div className="col-2">
                    <div className="form-floating my-3">
                    <select className="form-select" name="sortby" onChange={(e)=> handleSortBy(e.target.value)} value={sortBy}>
                        <option value="">--Select--</option>
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="price-low">Price (Low to High)</option>
                        <option value="price-high">Price (High to Low)</option>
                        <option value="rating-low">Rating (Low to High)</option>
                        <option value="rating-high">Rating (High to Low)</option>
                    </select>
                    <label htmlFor="floatingSelect">Sort by <i className={`bi ${sortIcon}`}></i></label>
                  </div>
                </div>
                }
            </div>
          {isLoading === true && (
            <div className="text-center m-auto my-5">
              <div
                className="spinner-border"
                style={{ width: "3rem", height: "3rem" }}
                role="status"
              ></div>
            </div>
          )}

          <div className="product-list row align-items-top pb-3 position-relative">
            {isSorting === true && <div className="overly"></div>}
            {isLoading === false && products.length ? (
              products.map((product) => (
                <div
                key={product.id}
                className="col-6 col-sm-6 col-md-4 col-lg-3 mb-3 align-top"
                >
                    <ProductCard product={product} 
                    openQuickView={openQuickView} 
                    closeQUickView={closeQUickView} 
                    hideQuickView={location.pathname === "/favorite"}/>
                </div>
              ))
            ) : isLoading===false && products.length === 0 && !isError ? (
                  <p className="text-center text-danger my-5 h-75 fs-5">
                  Products not found!
                  </p>
            ):''}
          </div>
        </div>
        {
          showQuickView && 
          <QuickProductView 
              product={quickViewProduct} 
              showModal={showQuickView} 
              onClose={closeQUickView} />
        }
      </div>
    </div>
  );
}
