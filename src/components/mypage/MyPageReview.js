import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar, FaTrash } from "react-icons/fa";
import { deleteReview } from "../../api/memberApi";
import { useState } from "react";

const MyPageReview = ({ reviews, refreshData }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 4;

  // 리뷰 데이터를 reviewNo순으로 정렬
  const sortedReviews = [...reviews].sort((a, b) => b.previewNo - a.previewNo);

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = sortedReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openDeleteModal = (review) => {
    setSelectedReview(review);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedReview(null);
  };

  const handleDeleteReview = async () => {
    if (!selectedReview) return;

    try {
      const response = await deleteReview(selectedReview.previewNo);
      if (response) {
        alert("리뷰가 삭제되었습니다!!!");
        closeModal();
        refreshData();
      } else {
        alert("리뷰 삭제에 실패했습니다!!!");
      }
    } catch (error) {
      console.error("리뷰 삭제 오류:", error);
      alert("리뷰 삭제 중 문제가 발생했습니다!!!");
    }
  };

  return (
    // <div className="flex justify-end ml-20 h-auto select-none">
    <div className="flex justify-end ml-[1rem] mt-[0.5rem] min-h-[85vh] select-none">
      <div className="bg-white p-8 rounded-lg shadow-lg mt-20 w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4 select-none">
          내 리뷰
        </h2>

        {sortedReviews.length === 0 ? (
          <div className="h-[656px]">
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-center select-none text-lg">
                작성한 리뷰가 없습니다.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="min-h-[596px]">
              <ul className="space-y-4">
                {currentReviews.map((review) => (
                  <li
                    key={review.previewNo}
                    className="bg-gray-100 p-3 rounded-md"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-semibold flex items-center whitespace-nowrap overflow-x-auto">
                        <Link
                          to={`/product/read/${review.pno}`}
                          className="text-black hover:text-blue-500"
                        >
                          {review.pname || "상품명 없음"}
                        </Link>
                        <span className="mx-4 text-gray-400">|</span>
                        <span className="text-sm text-gray-500">
                          {review.dueDate}
                        </span>
                      </h4>

                      <button
                        className="text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1 text-sm"
                        onClick={() => openDeleteModal(review)}
                      >
                        <FaTrash size={14} />
                        <span>삭제</span>
                      </button>
                    </div>

                    <p className="text-sm text-gray-500 flex items-center">
                      별점({review.reviewRating}) :
                      <span className="text-sm text-yellow-300 inline-flex pl-1">
                        {[...Array(Math.floor(review.reviewRating))].map(
                          (_, i) => (
                            <FaStar key={`full-${i}`} />
                          )
                        )}
                        {review.reviewRating % 1 !== 0 && <FaStarHalfAlt />}
                        {[...Array(Math.floor(5 - review.reviewRating))].map(
                          (_, i) => (
                            <FaRegStar key={`empty-${i}`} />
                          )
                        )}
                      </span>
                    </p>
                    <p className="text-md mt-2">{review.reviewtext}</p>
                  </li>
                ))}

                {/* 빈 항목 추가 (리뷰가 4개 미만일 경우) */}
                {currentReviews.length < reviewsPerPage &&
                  Array.from({
                    length: reviewsPerPage - currentReviews.length,
                  }).map((_, idx) => (
                    <li
                      key={`empty-${idx}`}
                      className="bg-gray-100 p-5 rounded-md invisible"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-semibold flex items-center">
                          <span>상품명 없음</span>
                          <span className="mx-4 text-gray-400">|</span>
                          <span className="text-sm text-gray-500">날짜</span>
                        </h4>
                        <button className="text-gray-400 flex items-center gap-1 text-sm">
                          <FaTrash size={14} />
                          <span>삭제</span>
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center">
                        별점(5) :
                        <span className="text-sm text-yellow-300 inline-flex pl-1">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                        </span>
                      </p>
                      <p className="text-md mt-2">리뷰 내용</p>
                    </li>
                  ))}
              </ul>
            </div>

            {/* 페이지네이션 - 항상 표시 */}
            <div className="flex justify-center mt-6 space-x-2">
              {totalPages > 0 ? (
                Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      currentPage === index + 1
                        ? "bg-orange-400 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))
              ) : (
                // 페이지가 1개 이하인 경우에도 버튼 표시
                <button className="px-4 py-2 rounded-md text-sm font-medium bg-orange-400 text-white">
                  1
                </button>
              )}
            </div>
          </>
        )}

        {/* 삭제 확인 모달 */}
        {modalOpen && selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
              <h3 className="text-xl font-bold mb-4">리뷰 삭제 확인</h3>
              <p className="mb-6">정말로 이 리뷰를 삭제하시겠습니까?</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleDeleteReview}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  삭제
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPageReview;
