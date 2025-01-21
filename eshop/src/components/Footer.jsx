import { Link } from "react-router-dom";

export function Footer() {
  return (
    <div className="container-fluid bg-dark text-white">
      {/* <footer className="container justify-content-between align-items-center mb-0 py-1">
        <span className="mb-3 d-block m-auto text-center pt-2">
            Developed by <span className="text-warning">Chirag Khatri</span> | Technology: <span className="text-info">ReactJS 18</span> | CSS Framework: <span className="text-info">BootStrap 5</span> | Form Library: <span className="text-warning">Formik</span> | State Management: <span className="text-warning">Context API / useReducer</span>
          </span>

        <p className="justify-content-center d-flex">         
          <span>
            <Link to="https://www.linkedin.com/in/khatri-chirag/" target="_blank" className="bi bi-linkedin text-primary fs-2" title="LinkedIn: khatri-chirag"></Link>
          </span>
          <span className="mx-3">
            <Link to="https://github.com/imchiragkhatri" target="_blank" className="bi bi-github text-white fs-2" title="Github: imchiragkhatri"></Link>
          </span>
          <span>
            <Link to="https://www.youtube.com/@LearnandShareOnline" target="_blank" className="bi bi-youtube text-danger fs-2" title="YouTube: @LearnandShareOnline"></Link>
          </span>
          <span className="ms-3">
            <Link to="https://www.Learn-and-Share.in" target="_blank" className="bi bi-globe text-success fs-2" title="Website: www.Learn-and-Share.in"></Link>
          </span>
        </p>
      </footer> */}
     <footer className=" mb-0 py-2">
        <ul className="nav justify-content-center border-bottom pb-3 mb-3 text-white">
          <li className="nav-item"><Link to="/" className="nav-link px-2 text-white">Home</Link></li>
          <li className="nav-item"><Link to="/about" className="nav-link px-2 text-white">About the App</Link></li>
          <li className="nav-item"><Link to="/profile" className="nav-link px-2 text-white">My Profile</Link></li>
          <li className="nav-item"><Link to="/orders" className="nav-link px-2 text-white">My Orders</Link></li>
        </ul>

        <div className="d-flex flex-wrap justify-content-between align-items-center">
           <div className="col-md-4 d-flex align-items-center">       
            <span className="mb-3 mb-md-0 ">Developed by <span className="text-warning">Chirag Khatri</span></span>
          </div>
          <div className="nav col-md-4 justify-content-end list-unstyled d-flex">
            <Link to="mailto:info@example.com" className="text-white bi bi-envelope-at fs-5" title="Mail me @ chirag.khatri@gmail.com"></Link>
            <Link to="https://www.linkedin.com/in/khatri-chirag/" target="_blank" className="mx-3 bi bi-linkedin text-primary fs-5" title="LinkedIn: khatri-chirag"></Link>
            <Link to="https://www.Learn-and-Share.in" target="_blank"  className="bi bi-globe text-warning fs-5" title="Blog: www.Learn-and-Share.in"></Link>
            <Link to="https://github.com/imchiragkhatri" target="_blank" className="mx-3 bi bi-github text-white fs-5" title="Github: imchiragkhatri"></Link>
            <Link to="https://www.youtube.com/@LearnandShareOnline"  target="_blank" className="bi bi-youtube text-danger fs-4 align-baseline" title="YouTube: @LearnandShareOnline"></Link>
        </div>
        </div>
      </footer>
    </div>
  );
}
