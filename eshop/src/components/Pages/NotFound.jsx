export function NotFound() {
    document.title =  '404 - Page Not Found!';
    return (
        <div className="container-fluid">
        <div
            className="d-flex align-content-center align-items-center justify-content-center"
            style={{ minHeight: "400px" }}
        >
            <div className="text-center">
            <p>
                <i
                className="bi bi-exclamation-diamond text-warning"
                style={{ fontSize: "5rem" }}
                ></i>
            </p>
            <p className="text-danger text-center fs-5">
                The product you are looking for is not available
            </p>
            </div>
        </div>
        </div>
    );
}
