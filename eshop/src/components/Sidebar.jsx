import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../store/AppProvider";


export function Sidebar(props){
    const { formatPrice} = useAppContext();
    const {orgProducts, getPriceRange, getRating} = props;
    const [priceRange, setPriceRange] = useState([]);
    const [currentPriceRange, setCurrentPriceRange] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    
    
    useEffect(()=> {
        const generatePriceRanges = (minPrice, maxPrice, steps = 5) => {
             maxPrice = maxPrice + 1;
             const range = maxPrice - minPrice;
             const step = Math.ceil(range / steps); 
             const priceRanges = [];
           
             for (let start = minPrice; start < maxPrice; start += step) {
               let end = Math.min(start + step, maxPrice);
               const count = orgProducts.filter((p) =>  p.price >= start && p.price < end).length;
               start = Math.floor(start);
               end = Math.floor(end);  
               if(count > 0){
                 priceRanges.push({ start, end, count });
               }
             }
             return priceRanges;
           };
        if(orgProducts?.length){
            const prices = orgProducts.map((product) => product.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            const priceRanges = generatePriceRanges(minPrice, maxPrice);
            setPriceRange(priceRanges);
        }
        window.scrollTo(0, 0);
     },[orgProducts]);

     useEffect(() => {
        setCurrentPriceRange(getPriceRange);
     },[getPriceRange]);

     const clearFilter= (ft) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.delete(ft);

        navigate({
            pathname: location.pathname,
            search: searchParams.toString(),
        });
     }

     const setFilter = (ft,val)=> {
        const searchParams = new URLSearchParams(location.search);
        if(ft === 'price-range') { searchParams.delete('ratings'); }
        else { searchParams.delete('price-range'); }
        searchParams.set(ft, val);

        navigate({
            pathname: location.pathname,
            search: searchParams.toString(),
        });
     }

    return(       
         <nav className="">
            <h5 className="my-3 text-black">
                Price
            </h5>
                <ul className="nav nav-pills flex-column mb-auto text-black">
                    {
                        priceRange.map((range, index) => 
                            {
                            const { start, end, count } = range;
                            const label =
                                index === 0
                                    ? `Upto ${formatPrice(end,0)} (${count})`
                                    : index === priceRange.length - 1
                                    ? `Above ${formatPrice(start,0)} (${count})`
                                    : `${formatPrice(start,0)} - ${formatPrice(end,0)} (${count})`;
                            const range_string =
                                    index === 0
                                    ? `0-${end}`
                                    : index === priceRange.length - 1
                                    ? `${start}`
                                    : `${start}-${end}`;

                             return (
                                <li key={index} className="nav-item py-2 position-relative" data-current={getPriceRange} >
                                    {range_string === currentPriceRange || range_string === `${currentPriceRange}+` ?
                                     <span className="nav-link d-inline">{label} </span>
                                    :
                                    <span onClick={()=> setFilter('price-range',range_string)} className="nav-link text-dark d-inline"  style={{cursor:'pointer'}}>{label} </span>
                                    }

                                    { (getPriceRange !== '' && range_string === currentPriceRange) && 
                                                    <span className="bi bi-x text-danger" style={{cursor:'pointer', fontSize:'1.2rem'}} title="Clear" onClick={() => clearFilter('price-range')}></span>
                                                }
                                </li>
                                );
                            }
                        )
                    }
                </ul>
                              
                <h5 className="my-3 text-black">
                    Customer's Rating { getRating !== '' && 
                        <span className="float-end bi bi-x" style={{cursor:'pointer'}} title="Clear" onClick={() => clearFilter('ratings')}></span>
                    }
                </h5>
                <ul className="nav nav-pills flex-column mb-auto text-black">
                    <li className="nav-item">
                        <button className={`btn border-0 ${getRating===5?'opacity-50':''}`} onClick={()=> setFilter('ratings',5)} title="5 Stars Rating">
                            <i className="bi bi-star-fill full-star text-warning"></i>
                            <i className="bi bi-star-fill full-star text-warning"></i>
                            <i className="bi bi-star-fill full-star text-warning"></i>
                            <i className="bi bi-star-fill full-star text-warning"></i>
                            <i className="bi bi-star-fill full-star text-warning"></i>
                            <span> full star</span>
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`btn border-0  ${getRating===4?'opacity-50':''}`} onClick={()=> setFilter('ratings',4)} title="4 Stars Rating">
                            <i className="bi bi-star-fill full-star text-warning"></i>
                            <i className="bi bi-star-fill full-star text-warning"></i>
                            <i className="bi bi-star-fill full-star text-warning"></i>
                            <i className="bi bi-star-fill full-star text-warning"></i>
                            <i className="bi bi-star text-warning"></i>
                            <span> & above</span>
                        </button>
                    </li>
                    <li className="nav-item">
                        <button  className={`btn border-0  ${getRating===3?'opacity-50':''}`} onClick={()=> setFilter('ratings',3)} title="3 Stars Rating">
                            <i className="bi bi-star-fill full-star text-warning"></i>
                            <i className="bi bi-star-fill full-star text-warning"></i>
                            <i className="bi bi-star-fill full-star text-warning"></i>
                            <i className="bi bi-star text-warning"></i>
                            <i className="bi bi-star text-warning"></i>
                            <span> & above</span>
                        </button>
                    </li>
                    <li className="nav-item">
                        <button  className={`btn border-0 ${getRating===2?'opacity-50':''}`} onClick={()=> setFilter('ratings',2)}  title="2 Stars Rating">
                            <i className="bi bi-star-fill full-star text-warning"></i>
                            <i className="bi bi-star-fill full-star text-warning"></i>
                            <i className="bi bi-star text-warning"></i>
                            <i className="bi bi-star text-warning"></i>
                            <i className="bi bi-star text-warning"></i>
                            <span> & above</span>
                        </button>
                    </li>

                    <li className="nav-item">
                        <button  className={`btn  border-0 ${getRating===1?'opacity-50':''}`} onClick={()=> setFilter('ratings',1)} title="1 Star Rating">
                            <i className="bi bi-star-fill full-star text-warning"></i>
                            <i className="bi bi-star text-warning"></i>
                            <i className="bi bi-star text-warning"></i>
                            <i className="bi bi-star text-warning"></i>
                            <i className="bi bi-star text-warning"></i>
                            <span> & above</span>
                        </button>
                    </li>
                </ul>
        </nav>
    )
}