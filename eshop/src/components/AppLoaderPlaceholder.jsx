

export function AppLoaderPlaceHolder(){
    return(
        <div className="d-flex justify-content-center my-5">
            <div className="spinner-border my-5" style={{width: '3rem', height: '3rem'}} role="status">
            <span className="visually-hidden">Loading...</span>
            </div>

        </div>
    )
}