import React from "react";

const ResultModal = ({ content, callbackFn }) => {
  return (
    <div
      className="fixed top-0 left-0 z-[9999] w-full h-full flex items-start justify-center bg-black bg-opacity-50" // items-start로 수직 정렬을 상단으로 변경
      onClick={() => {
        if (callbackFn) {
          callbackFn();
        }
      }}
    >
      <div
        className="bg-white dark:bg-gray-800 w-96 rounded-lg shadow-lg p-6 flex flex-col items-center mt-16" // 상단 여백을 추가
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 배경이 클릭되지 않도록
      >
        {/* 내용 */}
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-6 text-center">
          {content}
        </div>

        {/* 버튼 */}
        <button
          className="bg-blue-500 text-white rounded-full px-6 py-2 text-lg hover:bg-blue-600 focus:outline-none transition-colors"
          onClick={() => {
            if (callbackFn) {
              callbackFn();
            }
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
