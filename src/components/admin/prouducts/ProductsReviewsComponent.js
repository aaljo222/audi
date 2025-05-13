import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteReview, getReviewList } from "../../../api/adminApi";
import AdminReviewModal from "../../customModal/AdminReviewModal";

const ProductsReviewsComponent = () => {
  const { pno } = useParams();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const navigate = useNavigate();
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getReviewList(pno)
      .then((response) => {
        setData(response);
        console.log(response);
      })
      .catch((error) => {
        console.error("리뷰 데이터 로딩 실패:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [pno, refresh]);

  const handleDeleteReview = (reviewNo) => {
    // 삭제 확인
    if (window.confirm("리뷰를 삭제하시겠습니까?")) {
      deleteReview(reviewNo)
        .then(() => {
          alert("리뷰를 삭제처리 하였습니다.");
          setRefresh(refresh + 1);
        })
        .catch((error) => {
          console.error("리뷰 삭제 실패:", error);
          alert("리뷰 삭제 중 오류가 발생했습니다.");
        });
    }
  };

  const openReviewModal = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white p-4 rounded shadow">
        <h1 className="text-xl font-bold mb-4">상품 리뷰 관리</h1>
        <div className="text-center py-8">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-4 rounded shadow">
      <h1 className="text-xl font-bold mb-4">상품 리뷰 관리</h1>

      {data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">리뷰번호</th>
                <th className="py-2 px-4 text-left">작성자</th>
                <th className="py-2 px-4 text-left">상품명</th>
                <th className="py-2 px-4 text-left">리뷰내용</th>
                <th className="py-2 px-4 text-left">평점</th>
                <th className="py-2 px-4 text-left">작성일</th>
                <th className="py-2 px-4 text-center">관리</th>
              </tr>
            </thead>
            <tbody>
              {data.map((review) => (
                <tr
                  key={review.proReivewNo}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="py-2 px-4">{review.proReivewNo}</td>
                  <td className="py-2 px-4">{review.userId}</td>
                  <td className="py-2 px-4">
                    <div className="max-w-md truncate">{review.pname}</div>
                  </td>
                  <td
                    className="py-2 px-4 cursor-pointer hover:text-blue-600"
                    onClick={() => openReviewModal(review)}
                  >
                    <div className="max-w-md truncate">{review.reviewtext}</div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      {review.reviewRating.toFixed(1)}
                    </div>
                  </td>
                  <td className="py-2 px-4">{review.dueDate}</td>
                  <td className="py-2 px-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleDeleteReview(review.proReivewNo)}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          등록된 리뷰가 없습니다
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={() => navigate("/admin/products/list")}
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
        >
          뒤로가기
        </button>
      </div>

      {/* 리뷰 상세 모달 */}
      <AdminReviewModal
        isOpen={isModalOpen}
        onClose={closeReviewModal}
        review={selectedReview || {}}
      />
    </div>
  );
};

export default ProductsReviewsComponent;
