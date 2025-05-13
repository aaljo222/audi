import React, { useState } from "react";

const MyPagePoint = ({ points, totalPoint }) => {
  // pointAmount가 0인 항목은 필터링하여 제외
  const filteredPoints = points.filter((point) => point.pointAmount !== 0);
  const sortedPointList = [...filteredPoints].sort(
    (a, b) => b.pointId - a.pointId
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pointsPerPage = 5;

  // 페이지 계산
  const indexOfLastPoint = currentPage * pointsPerPage;
  const indexOfFirstPoint = indexOfLastPoint - pointsPerPage;
  const currentPoints = sortedPointList.slice(
    indexOfFirstPoint,
    indexOfLastPoint
  );
  const totalPages = Math.ceil(sortedPointList.length / pointsPerPage);

  // 페이지 이동 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex justify-end ml-[1rem] mt-[0.5rem] min-h-[85vh] select-none">
      <div className="bg-white p-8 rounded-lg shadow-lg mt-20 w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-4">
          포인트 내역
        </h2>

        {sortedPointList.length === 0 ? (
          <div className="h-[664px]">
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-center select-none text-lg">
                포인트 내역이 없습니다.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* 현재 포인트 표시 */}
            <div className="text-left mb-5">
              <div className="flex items-center mb-2">
                <span className="text-lg font-medium">현재 포인트: </span>
                <span className="ml-2 text-xl font-bold">
                  {totalPoint.toLocaleString()}P
                </span>
              </div>
              <div className="border-b border-gray-200 my-4" />
            </div>

            <div className="h-[535px]">
              {currentPoints.map((point) => (
                <div
                  key={point.pointId}
                  className="border-b border-gray-100 pb-6 mb-5"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col text-left">
                      <span className="text-base font-bold">
                        {point.eventType}
                      </span>
                      <span className="text-sm mt-1">{point.reason}</span>
                      <span className="text-xs text-gray-500 mt-1">
                        적립 : {point.issueDate}
                      </span>
                    </div>
                    <div
                      className={`text-base font-medium min-w-[80px] text-right ${
                        point.pointAmount > 0 ? "text-blue-600" : "text-red-500"
                      }`}
                    >
                      {point.pointAmount > 0
                        ? `+${point.pointAmount.toLocaleString()}P`
                        : `${point.pointAmount.toLocaleString()}P`}
                    </div>
                  </div>
                </div>
              ))}

              {Array.from({ length: 5 - currentPoints.length }).map(
                (_, idx) => (
                  <div
                    key={`empty-${idx}`}
                    className="border-b border-gray-100 pb-6 mb-6 invisible"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col text-left">
                        <span className="text-base font-bold">.</span>
                        <span className="text-sm mt-1">.</span>
                        <span className="text-xs text-gray-500 mt-1">.</span>
                      </div>
                      <div className="text-base font-medium min-w-[80px] text-right">
                        .
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {totalPages > 0 && (
              <div className="flex justify-center mt-7 space-x-2">
                {Array.from({ length: totalPages }, (_, index) => (
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
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyPagePoint;
