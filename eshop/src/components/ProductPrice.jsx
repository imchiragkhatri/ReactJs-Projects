

export function ProductPrice(props){
    const discountAmount = (props.price * props.discount) / 100;
    const priceAfterDiscount = props.price - discountAmount;
    return(
        <>
        <span style={{ textDecoration: 'line-through', color: 'red', marginRight: '10px' }}>
          ${props.price.toFixed(2)}
        </span>
  
        <span style={{ fontWeight: 'bold', color: 'green' }}>
          ${priceAfterDiscount.toFixed(2)}
        </span>
      </>
    )
}