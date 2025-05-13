import React, { useEffect, useState } from "react";
import { getReview } from "../../api/productsApi";
import ReactStars from "react-rating-stars-component";

const ReviewComponent = ({ rating, count, pno }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getReview(pno).then((data) => {
      setReviews(data);
      console.log(data);
    });
  }, [pno]);

  const renderStars = (rating) => {
    const ratingChanged = (newRating) => {
      console.log(newRating);
    };

    return (
      <div className="flex items-center">
        <ReactStars
          count={5}
          value={rating}
          onChange={ratingChanged}
          size={20}
          activeColor="#fbbf24"
          isHalf={true}
          edit={false} 
        />
      </div>
    );
  };

  return (
    <section className="bg-white p-6 border border-[#ad9e87] border-opacity-30 rounded-lg mt-6 w-2/3 mx-auto">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
        상품리뷰
      </h3>
      <div className="mt-2 flex items-center">
        {renderStars(rating)}
        <span className="ml-2 text-gray-600 text-sm">({count}개의 리뷰)</span>
      </div>
      <div className="mt-4 space-y-3">
        {reviews.length === 0 ? (
          <div className="text-gray-600 text-sm">아직 리뷰가 없습니다.</div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.preivewNo}
              className="bg-gray-100 p-4 rounded-lg shadow-sm border flex items-start space-x-3"
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">
                  {review.userId}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {review.reviewtext}
                </p>
                <div className="mt-1">{renderStars(review.reviewRating)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default ReviewComponent;
