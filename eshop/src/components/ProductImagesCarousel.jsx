import { useState } from "react";


export function ProductImagesCarousel({images})
{
    const [currentIndex, setCurrentIndex] = useState(0);

  // Handle next and previous clicks
  const handlePrevClick = () => {
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
  };

  const handleNextClick = () => {
    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(nextIndex);
  };

  return (
    <div id="productCarousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        {images.map((image, index) => (
          <div className={`carousel-item ${index === currentIndex ? 'active' : ''}`} key={index}>
           <img
              src={image}
              className="d-block carousel-img"
              alt={`Alternate ${index} view of product`}
              style={{ maxHeight: '300px', objectFit: 'cover', margin: '0 auto' }} // Ensure no stretching
            />
          </div>
        ))}
      </div>
      {/* Carousel Controls */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#productCarousel"
        data-bs-slide="prev"
        onClick={handlePrevClick}
        style={{ background: 'none', border: 'none', outline: 'none' }}
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" style={{ filter: 'invert(1)' }}></span>

        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#productCarousel"
        data-bs-slide="next"
        onClick={handleNextClick}
        style={{ background: 'none', border: 'none', outline: 'none' }}
      >
        <span className="carousel-control-next-icon" aria-hidden="true"  style={{ filter: 'invert(1)' }}></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}