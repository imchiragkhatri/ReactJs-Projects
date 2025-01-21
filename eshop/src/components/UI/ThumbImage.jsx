import { useState } from "react";


export const ThumbImage = (props) => {
    const {image, title, imgClass} = props;
    const [isLoaded, setIsLoaded] = useState(false);

    const handleImageLoad =() => {
        setIsLoaded(true);
    }
    return(
        <>
            { isLoaded === false && (
                <div className="placeholder-glow text-black-50">
                    <p className="placeholder img-placeholder rounded rounded-4 text-center rounded-bottom-0 col-12">Loading...</p>
                </div>
            )}
               
                <img
                    src={image}
                    className={`${imgClass} img-fluid thumb-image ${isLoaded?'loaded':'loading'}`}
                    alt={title}
                    onLoad={handleImageLoad}
                    loading="lazy"
                />
        </>
    )
}

