import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { ProductCard } from "./ProductCard";

export function SearchResults()
{   
    const [orgProducts, setOrgProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const query = params.get("q") || "";

    const [sortBy, setSortBy] = useState('');
    const [sortIcon, setSortIcon] = useState(null);
    const [isSorting, setIsSorting] = useState(false);
    const navigate = useNavigate();
    const getSortBy = params.get("sortby") || '';
    const getPriceRange = params.get("price-range") || "";
    const getRating =  params.get("ratings") || "";

    const loadProducts =(url, signal) => {
        setIsLoading(true);
        axios
          .get(url, { signal })
          .then((response) => {
            const prodData = response.data.products;
            setOrgProducts(prodData);
            setProducts(prodData);
            setIsLoading(false);
          })
          .catch((error) => {
            if (axios.isCancel(error)) {
              console.log("Request cancelled!", error.message);
            } else {
              console.log(error);
            }
            setIsLoading(false);
          });
      }

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
    useEffect(()=>{
        const controller = new AbortController();
        const signal = controller.signal;
        if(query !== '')
        {
            document.title = "Search: " + query + " - Demo Store by Chirag Khatri";
            loadProducts("https://dummyjson.com/products/search?q=" + query, signal);
        }
        else
        {
            document.title = "Search: " + query + " - Demo Store by Chirag Khatri";
            loadProducts("https://dummyjson.com/products/?limit=32", signal);
        }
    },[query]);

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
      setProducts(products);
    }
  }, [getPriceRange, getRating, getSortBy, orgProducts, products, sortProducts]);

     
        return (
            <div className="container-fluid"> 
                <div className="row">
                <div className="col-2 col-md-2 d-none d-md-block border-end">
                    {orgProducts?.length > 0 &&
                        <Sidebar orgProducts={orgProducts} getPriceRange={getPriceRange.trim()} />
                    }
                </div>
            
                <div className="col-12 col-md-10">
                  {(isLoading === true && products.length===0) && (
                    <div className="text-center m-auto my-5">
                        <div
                        className="spinner-border"
                        style={{ width: "3rem", height: "3rem" }}
                        role="status"
                        ></div>
                    </div>
                    )}

                    <div className="row">
                      <div className="col">
                          <h2 className="my-4 text-center">{ query !== "" &&  `Search result(s) for "${query}"` }</h2>
                      </div>
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
            
                    <div className="product-list row align-items-top pb-3 position-relative">
                      {isSorting === true && <div className="overly"></div>}                  
                    {isLoading === false && products.length ? (
                        products.map((product) => (
                        <div
                            key={product.id}
                            className="col-6 col-sm-6 col-md-4 col-lg-3 align-top"
                        >
                            <ProductCard product={product} />
                        </div>
                        ))
                    ) : isLoading===false && products.length === 0 ? (
                            <p className="text-center text-danger my-5 fs-5">
                            Products not found!
                            </p>
                    ):''}
                    </div>
                </div>
                
                </div>
            </div>
          );
}