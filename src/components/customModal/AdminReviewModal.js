import React from "react";

const AdminReviewModal = ({ isOpen, onClose, review }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">리뷰 상세보기</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="font-medium">상품명</div>
            <div className="col-span-2">{review.pname}</div>

            <div className="font-medium">작성자</div>
            <div className="col-span-2">{review.userId}</div>

            <div className="font-medium">평점</div>
            <div className="col-span-2">
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                {review.reviewRating?.toFixed(1)}
              </div>
            </div>

            <div className="font-medium">작성일</div>
            <div className="col-span-2">{review.dueDate}</div>
          </div>

          <div className="border-t pt-4">
            <div className="font-medium mb-2">리뷰 내용</div>
            <div className="bg-gray-50 p-4 rounded whitespace-pre-wrap">
              {review.reviewtext}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminReviewModal;
