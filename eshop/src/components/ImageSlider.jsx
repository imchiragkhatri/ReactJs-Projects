import { Link } from "react-router-dom";


export function ImageSlider() {
  const sliderProducts = [
    {
      image: "sunglasses.jpg",
      url: "sunglasses",
      title: "See the World in Style",
      subTitle: "Discover shades that elevate your look and protect your eyes.",
      heading_class: "text-white text-shadow",
      caption_class: "text-top", // Options: text-top, text-bottom, text-left, text-right, default center
    },
    {
      image: "womens-bags.jpg",
      url: "womens-bags",
      title: "Your Perfect Companion",
      subTitle: "Chic, versatile bags to suit every occasion.",
      heading_class: "text-black text-shadow",
      caption_class: "text-top",
    },
    {
      image: "fragrances.jpg",
      url: "fragrances",
      title: "Scents That Stay With You",
      subTitle: "Discover fragrances that leave a lasting impression.",
      heading_class: "text-black",
      caption_class: "text-top",
    },
    {
      image: "furniture.jpg",
      url: "furniture",
      title: "Pieces That Tell a Story",
      subTitle: "From contemporary to classic - furniture for every style.",
      heading_class: "text-black",
      caption_class: "text-top",
    },
  ];

  return (
    <div className="row1">
      <div
        id="homeHeroCarousel"
        data-bs-ride="carousel"
        data-bs-interval="5000"
        className="carousel carousel-dark slide"
        style={{ background: "#eeeeee", maxHeight: "600px" }}
      >
        <div className="carousel-indicators indicator-hover">
          {sliderProducts.map((product, index) => (
            <button
              key={product.title}
              type="button"
              data-bs-target="#homeHeroCarousel"
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
              aria-current="true"
              aria-label={product.title}
            ></button>
          ))}
        </div>
        <div className="carousel-inner">
          {sliderProducts.map((product, index) => (
            <div
              className={`text-center carousel-item ${
                index === 0 ? "active" : ""
              }`}
              key={product.title}
            >
              <div
                className={`carousel-caption d-md-block ${product.caption_class}`}
              >
                <h6 className={product.heading_class}>{product.title}</h6>
                {product.subTitle !== "" && (
                  <span className={product.heading_class}>
                    {product.subTitle}
                  </span>
                )}
                <p>
                  <Link to={product.url} className="btn mt-3 btn-dark">
                    SHOP NOW <i className="bi bi-arrow-right"></i>
                  </Link>
                </p>
              </div>

              <img
                src={`/home-banners/${product.image}`}
                className={`mx-auto d-block img-fluid w-100`}
                alt={product.title}
              />
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#homeHeroCarousel"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#homeHeroCarousel"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
