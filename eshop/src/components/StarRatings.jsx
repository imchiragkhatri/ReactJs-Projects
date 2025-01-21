import React from "react";

const StarRating = ({ rating, totalReviews,prefix }) => {
  const fullStars = Math.floor(rating); // Number of full stars
  const halfStar = rating % 1 >= 0.5 ? 1 : 0; // Half star if remainder >= 0.5
  const emptyStars = 5 - fullStars - halfStar; // Remaining empty stars

  const stars = [];
  
  for (let i = 0; i < fullStars; i++) {
    stars.push(<i key={`full-${i}`} className="bi bi-star-fill"></i>);
  }
  if (halfStar) {
    stars.push(<i key="half" className="bi bi-star-half"></i>);
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<i key={`empty-${i}`} className="bi bi-star"></i>);
  }

  return <><div className="rating text-warning d-inline">{stars} </div>{ totalReviews !==0 ? ` ${totalReviews} ${prefix}`:'' }</>;
};

export default StarRating;
