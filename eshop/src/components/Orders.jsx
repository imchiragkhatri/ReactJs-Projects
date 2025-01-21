import { useAppContext } from "../store/AppProvider";

export function Orders() {
  const {formatPrice} = useAppContext()
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
 
  function formatOrderDate(timestamp) {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  return (
    <main className="container m-auto">
      <h1 className="text-center my-5">My Orders</h1>
      <div className="accordion my-5" id="myAccount">
          
          <div
            id="collapseTwo"
            className="accordion-collapse"
            data-bs-parent="#myAccount"
          >
            <div className="accordion-body">
              {orders.length === 0 ? (
                <strong>Order not found...</strong>
              ) : (
                orders.map((order) => (
                  (order.orderNumber !== "" && order.items) && 
                  <div key={order.orderNumber} className="my-2" title="Click for Order Details">
                    <p className="d-0flex gap-1 mb-4">
                      <button
                        className="btn btn-normal w-100 border border-bottom border-1 d-flex justify-content-between py-3 btn-order-title"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#${order.orderNumber}`}
                        aria-expanded="false"
                        aria-controls="collapseExample"
                      >
                        <span>
                          Order: <strong>#{order.orderNumber}</strong>
                        </span>
                        <span className="d-none d-lg-block">Date: {formatOrderDate(order.orderNumber)}</span>
                        <span className="d-none d-lg-block">Total Items: {order.items.length}</span>
                        <span className="d-none d-lg-block">
                          Order Total: <strong>${order.total}</strong>
                        </span>                       
                      </button>
                    </p>
                    <div className="collapse orders-accordion" id={`${order.orderNumber}`}>
                      <div className="card card-body my-3">
                        <div className="container text-center">
                          {order.items.map((item, index) => (
                            <div className="row item-row" key={`${order.orderNumber}-${index}`}>
                              <div className="col-2">
                                <img
                                  src={item.thumbnail}
                                  height="100"
                                  alt={item.title}
                                />
                              </div>
                              <div className="col text-start">{item.title} <br /><small className="text-muted">({item.qty} x {formatPrice(item.price)})</small></div>
                              <div className="col-2 text-end">
                                {formatPrice(item.price)}
                              </div>
                            </div>
                          ))}
                          <div className="row border border-top-2">
                            <div className="col-md-10 col-6 text-end">
                              <strong>Item(s) Total: </strong><br />
                              Discount: <br />
                              Shipping: <br />
                              <strong>Total:</strong>
                            </div>
                            <div className="col-md-2 col-6 text-end">
                              <span className="pr-4">
                              <strong>{formatPrice(order.subTotal)}</strong> <br />
                                -{formatPrice(order.discount ? order.discount : 0)} <br />
                                { (order.shipping && order.shipping?.amount > 0) ? formatPrice(order.shipping.amount) :"FREE"} <br />
                                <strong>{formatPrice(order.total)}</strong>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
      </div>
    </main>
  );
}
