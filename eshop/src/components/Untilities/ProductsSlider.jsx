import {useEffect } from 'react';
import { useAppContext } from '../../store/AppProvider';
import { Carousel } from 'bootstrap';

const ProductsSlider = ({ categories }) => {
  
  
  return (
    <div>
      {categories.map((category) => (
        <div key={category.category} className="mb-5">
          {/* Category Title */}
          <h3 className="text-center mb-3">{category.title}</h3>

          {/* Carousel */}
          <div
            id={`carousel-${category.category}`}
            className="carousel slide products-carousel"
          >
            {/* Carousel Indicators */}
            <div className="carousel-indicators">
              {Array.from({
                length: Math.ceil(category.products.length / 4), // 4 items per slide
              }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  data-bs-target={`#carousel-${category.category}`}
                  data-bs-slide-to={index}
                  className={index === 0 ? "active" : ""}
                  aria-label={`Slide ${index + 1}`}
                ></button>
              ))}
            </div>

            {/* Carousel Inner */}
            <div className="carousel-inner">
              {Array.from({
                length: Math.ceil(category.products.length / 4),
              }).map((_, slideIndex) => (
                <div
                  className={`carousel-item ${slideIndex === 0 ? "active" : ""}`}
                  key={slideIndex}
                >
                  <div className="row">
                    {category.products
                      .slice(slideIndex * 4, slideIndex * 4 + 4) // 4 items per slide
                      .map((product) => (
                        <div className="col-md-3" key={product.id}>
                          <div className="card">
                            <img
                              src={product.thumbnail}
                              className="card-img-top"
                              alt={product.title}
                            />
                            <div className="card-body">
                              <h5 className="card-title">{product.title}</h5>
                              <p className="card-text">${product.price}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Controls */}
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target={`#carousel-${category.category}`}
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target={`#carousel-${category.category}`}
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsSlider;
