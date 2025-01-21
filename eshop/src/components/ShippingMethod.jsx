import { useAppContext } from "../store/AppProvider";

export function ShippingMethod(props){    
    const {shipping,shippingMethods, hadleShippingMethod} = props;
    const { formatPrice} = useAppContext();
   // console.log(shipping);
    return(
        <>
            <h3 className="mb-3 text-primary-emphasis">Shipping Method</h3>
                <div>
                  {
                    shippingMethods.map((ship,index) => (
                      <div key={ship.name} className="form-check">
                        <input 
                        type="radio" 
                        name="shippingMethod" 
                        id={`shippingMethod${index}`} 
                        value={ship.id}  
                        className="form-check-input" 
                        checked={shipping.id===ship.id} 
                        onChange={()=> hadleShippingMethod(ship)} 
                        />
                        <label htmlFor={`shippingMethod${index}`}  className="form-label ms-1">{ship.name} {ship.amount > 0 ? `${formatPrice(ship.amount)}`: ''} - {ship.info}</label>
                      </div>
                    ))
                  }
                 
                </div>
        </>
    )
}