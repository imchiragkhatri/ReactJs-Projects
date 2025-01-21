import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PageAutoScroll = () => {
  const location = useLocation();
  const [key, setKey] = useState(0);

  
  useEffect(() => {
    setKey((prevKey) => prevKey + 1); 
    const scrollTop = () => {
        window.scrollTo(0,0);
        
    }    
    scrollTop();
  }, [location.pathname]);

  return <div key={key} />
};

export default PageAutoScroll;