import { useLocation } from "react-router-dom";
import { Header2 } from "./Header2";
import { HeaderCheckout } from "./HeaderCheckout";

export function Header() {
  const location = useLocation();
  const getTitle = location.pathname.replace('/','');
  if(location.pathname === '/checkout' || location.pathname === '/cart' || location.pathname === '/success')
  {
    return (<HeaderCheckout title={getTitle==='cart'?'Shopping Cart':getTitle==='checkout'?'Secure Checkout':'Order Placed'} />);
  }
 else {
  return (<Header2 />)
 }
}
