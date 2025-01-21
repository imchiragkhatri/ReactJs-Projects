import { useEffect, useState } from "react";
import '../../src/ProductImages.css';
export function ProductImages({ images, thumbSize, title }) {
    const[selImageIndex, setSelImageIndex] = useState(0);
    const[curImage, setCurImage] = useState();
    const [fade, setFade] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const showEnlargeImage = (img) => {
      setShowModal(true); 
    }

    const closeImageEnlarge = () => {
      setShowModal(false);
    }

    const handleImageChange = index => {
        setFade(true);
        setTimeout(() => {
          setCurImage(images[index]);
          setSelImageIndex(index);
          setFade(false);
        }, 300); 
    }

    const [loadedImages, setLoadedImages] = useState(
        Array(images.length).fill(false) // Array to track loading state of each image
    );

    const loaderColor = ['text-primary', 'text-secondary', 'text-success', 'text-danger', 'text-warning', 'text-info', 'text-dark' ]

   // console.log(loadedImages);
    const handleImageLoad = (index) => {        
        setLoadedImages((prevState) => {
          const updatedState = [...prevState];
          updatedState[index] = true;
          return updatedState;
        });
      };

      useEffect(()=>{
        setCurImage(images[0]);
      },[images])


  return (
    <>
      <div className="product-image position-relative">
      {!loadedImages[0] && (
                <div className="image-loader">
                  {/* Add a spinner or loader */}
                  <div className={`spinner-border ${loaderColor[0]}`} role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
        <img
            src={curImage}
            alt={title}
            onLoad={() => handleImageLoad(0)}
            onClick={showEnlargeImage}
            className={`img-fluid main-image ${fade ? 'fade-out' : 'fade-in'}`}
        />
      </div>

      <div className="mt-3 d-flex flex-wrap justify-content-center align-items-center position-relative">
        {images?.length > 1
          ? images.map((im, index) => (
              <div
                key={index}
                className={
                    `border additional-images rounded position-relative m-1 
                    ${index === selImageIndex ? "border-secondary " : "border-secondary-subtle"}
                    `
                }
                onClick={() => handleImageChange(index)} // Use arrow function to set selected index
                style={{ cursor: "pointer" }}
              >
                {!loadedImages[index] && (
                    <div className="loader-wrapper position-absolute d-flex justify-content-center align-items-center">
                        <div className={`spinner-border ${loaderColor[index]}`} role="status">
                        <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
                <img
                  src={im}
                  style={{           
                    maxHeight: `${thumbSize.height}px`,
                    maxWidth:`${thumbSize.width}px`,
                    opacity: loadedImages[index] ? 1 : 0, // Show image only after it's loaded
                    transition: "opacity 0.3s ease-in-out",
                  }}
                  onLoad={() => handleImageLoad(index)}
                  data-class = {loaderColor[index]}
                  alt={`Thumbnail ${index}`}
                />
              </div>
            ))
          : ""}
      </div>

      {showModal && 
          <div
          className={`modal fade ${showModal ? "show d-block" : ""}`}
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content" style={{ width: "90vw" }}>
              <div className="modal-header">
                <h5 className="modal-title">{title}</h5>
                <button type="button" className="btn-close" onClick={closeImageEnlarge}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                    <img src={curImage} alt={title} className="img-fluid" />
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
}
