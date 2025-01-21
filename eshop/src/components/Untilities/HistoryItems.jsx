import { Link } from "react-router-dom";
import { useAppContext } from "../../store/AppProvider";

export function HistoryItems() {
  const { state, dispatch, location } = useAppContext();

  if(location.pathname === "/cart" || location.pathname === '/checkout' || location.pathname === '/signin' || location.pathname === '/success' )
  {
    return null;
  }
  const { historyItems } = state;
  if (!historyItems || historyItems.length === 0) {
    return null;
  }
  const handleDeleteHistory = ()=>
  {
    let confirmDelete = window.confirm("Are you sure to remove history items?");
    if(confirmDelete)
    {
        dispatch({type:'CLEAR_HISTORY', payload:[]});
    }
  }

  return (
    <div className="container-fluid history-items-container mt-3 mb-4">
      <h3 className="mb-3 pb-1 border-bottom">Recently Viewed 
        <span 
            className="d-inline-block text-primary fs-6 mb-2 ms-2 align-middle"
            style={{cursor:'pointer'}}
            onClick={handleDeleteHistory}
        >Delete All</span>
      </h3>
      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-3">
        {historyItems.map((item,index) => (
             (item.title !== '' && item.thumbnail !== '') &&
                <div key={`${item.id}-${index}`} className="col">
                    <div className="card text-center h-100 shadow-sm position-relative">
                        <button
                            className="btn btn-sm text-danger position-absolute top-0 end-0 m-2 bi bi-trash"
                            style={{ zIndex: 10 }}
                            onClick={() => dispatch({type:'REMOVE_HISTORY', payload:item.id}) }
                            title="Remove from history"
                        >
                            
                        </button>
                        <Link
                        to={`/${item.category}/${item.id}`}
                        className="text-decoration-none text-dark"
                        title={item.title}
                        >
                            <div className="card text-center">
                                <img
                                src={item.thumbnail}
                                alt={item.title}
                                className="card-img-top m-auto"
                                style={{ maxWidth: "150px" }}
                                />
                                <div className="card-body p-2">
                                    <p className="card-text text-truncate m-0">{item.title}</p>
                                </div>
                            </div>
                        </Link>
                </div>
                </div>
        ))}
      </div>
    </div>
  );
}
