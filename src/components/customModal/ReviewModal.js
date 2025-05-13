import React, { useState } from "react";
import axios from "axios";

const ReviewModal = ({ isOpen, onClose, item, onSuccess }) => {
  const [reviewContent, setReviewContent] = useState("");
  const [rating, setRating] = useState(5);

  // 모달이 열려있지 않으면 렌더링하지 않음
  if (!isOpen || !item) return null;

  // 슬라이더 값 변경 핸들러
  const handleRatingChange = (e) => {
    // value는 문자열로 오기 때문에 parseFloat로 숫자 변환
    setRating(parseFloat(e.target.value));
  };

  // 리뷰 제출 핸들러
  const handleSubmitReview = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const reviewData = {
        reviewRating: rating,
        reviewtext: reviewContent,
        pno: item.pno,
        orderNum: item.realOrderNum,
        uid: user.uid,
      };

      await axios.post(
        "http://localhost:8089/api/member/add/review",
        reviewData
      );

      setReviewContent("");
      setRating(5);

      alert("리뷰가 성공적으로 등록되었습니다.");
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error("리뷰 등록 실패:", error);
      alert("리뷰 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">리뷰 작성</h2>
        <div className="mb-4">
          <p className="font-medium">{item.productName}</p>
          <div className="flex items-center mt-2">
            <img
              src={
                item.imgFileName
                  ? `http://localhost:8089/product/view/s_${item.imgFileName}`
                  : "/images/defalt.jpg"
              }
              alt={item.productName}
              className="w-20 h-20 object-contain rounded-lg mr-4"
            />
            <div>
              <p className="text-sm">{item.numOfItem}개</p>
              <p className="font-medium">
                {item.productPrice.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* 별점 슬라이더 */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">평점: {rating}</label>
          <div className="flex items-center">
            <span className="mr-2 text-gray-500">1</span>
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={rating}
              onChange={handleRatingChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[rgb(251,146,6)]"
            />
            <span className="ml-2 text-gray-500">5</span>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>매우 불만족</span>
            <span>매우 만족</span>
          </div>
        </div>

        {/* 리뷰 내용 */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">리뷰 내용</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(251,146,6)] focus:border-transparent"
            rows="4"
            placeholder="제품에 대한 리뷰를 작성해주세요."
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
          ></textarea>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="px-4 py-2 text-white bg-[rgb(251,146,6)] rounded-md hover:bg-[rgb(231,126,0)] transition-colors"
            onClick={handleSubmitReview}
            disabled={!reviewContent.trim()}
          >
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
