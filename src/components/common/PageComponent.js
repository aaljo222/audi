import React from "react";

const PageComponent = ({ currentPage, totalPages, onPageChange }) => {
  // 페이지 번호 배열 생성 (현재 페이지 기준 앞뒤로 최대 2개씩)
  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2">
      {/* 처음 페이지로 이동 */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={`
          w-9 h-9 flex items-center justify-center rounded-full
          transition-all duration-200 ease-in-out
          ${
            currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-orange-100 hover:text-orange-500"
          }
        `}
        aria-label="첫 페이지"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="11 17 6 12 11 7"></polyline>
          <polyline points="18 17 13 12 18 7"></polyline>
        </svg>
      </button>

      {/* 이전 페이지로 이동 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          w-9 h-9 flex items-center justify-center rounded-full
          transition-all duration-200 ease-in-out
          ${
            currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-orange-100 hover:text-orange-500"
          }
        `}
        aria-label="이전 페이지"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      {/* 페이지 번호 버튼들 */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`
            w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium
            transition-all duration-200 ease-in-out
            ${
              currentPage === page
                ? "bg-orange-400 text-white shadow-md"
                : "text-gray-700 hover:bg-orange-100 hover:text-orange-500"
            }
          `}
        >
          {page}
        </button>
      ))}

      {/* 다음 페이지로 이동 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          w-9 h-9 flex items-center justify-center rounded-full
          transition-all duration-200 ease-in-out
          ${
            currentPage === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-orange-100 hover:text-orange-500"
          }
        `}
        aria-label="다음 페이지"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      {/* 마지막 페이지로 이동 */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`
          w-9 h-9 flex items-center justify-center rounded-full
          transition-all duration-200 ease-in-out
          ${
            currentPage === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-orange-100 hover:text-orange-500"
          }
        `}
        aria-label="마지막 페이지"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="13 17 18 12 13 7"></polyline>
          <polyline points="6 17 11 12 6 7"></polyline>
        </svg>
      </button>
    </div>
  );
};

export default PageComponent;
