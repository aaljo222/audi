import React, { useState, useEffect } from "react";
import ReviewModal from "../customModal/ReviewModal";
import CancelProductModal from "../customModal/CancelProductModal";
import { Link } from "react-router-dom";

const MyPageOrders = ({ orders, refreshData, uid }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 2;

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOrderNo, setSelectedOrderNo] = useState(null);

  //0415
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelPno, setCancelPno] = useState(null);
  const [cancelOrderNo, setCancelOrderNo] = useState(null);

  const handleCancelClick = (e, pno, orderNo) => {
    e.stopPropagation();
    setCancelPno(pno);
    setCancelOrderNo(orderNo);
    setIsCancelModalOpen(true);
  };

  const handleReviewClick = (item) => {
    setSelectedItem(item);
    setIsReviewModalOpen(true);
  };

  const handleReviewSuccess = () => {
    refreshData();
  };

  // 상품 주문 상태 한글 변환
  const getStatusText = (status) => {
    switch (status) {
      case "PAY_COMPLETED":
        return "결제 완료";
      case "SHIPPING":
        return "배송 중";
      case "DELIVERED":
        return "배송 완료";
      default:
        return status;
    }
  };

  //상품 주문 상태에 따른 글자색
  const getStatusColor = (status) => {
    switch (status) {
      case "PAY_COMPLETED":
        return "text-black";
      case "SHIPPING":
        return "text-yellow-600";
      case "DELIVERED":
        return "text-green-600";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // 환불 상태에 따른 UI 스타일
  const getRefundStyle = (refundStatus) => {
    switch (refundStatus) {
      case "WAITING":
        return {
          bgColor: "bg-yellow-50",

          textColor: "text-yellow-600",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          text: "환불 요청 중",
        };
      case "COMPLETE":
        return {
          bgColor: "bg-green-50",

          textColor: "text-green-600",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ),
          text: "환불 처리 완료",
        };
      case "REJECTED":
        return {
          bgColor: "bg-red-50",

          textColor: "text-red-600",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ),
          text: "환불 요청 거절",
        };
      default:
        return null;
    }
  };

  // 주문 날짜 및 시간 포맷 함수
  const formatOrderDate = (orderDate) => {
    const date = new Date(orderDate);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const period = hours < 12 ? "오전" : "오후";
    const formattedHours = hours % 12 || 12;

    return {
      date: `${year}-${month}-${day}`,
      time: `${period} ${formattedHours}:${minutes}`,
    };
  };

  useEffect(() => {
    console.log("받은 주문 내역:", orders);
  }, [orders]);

  // 최신순 정렬
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
  );

  // 날짜별 그룹화
  const groupedOrders = sortedOrders.reduce((acc, order) => {
    const { date, time } = formatOrderDate(order.orderDate);
    if (!acc[date]) acc[date] = [];
    acc[date].push({ time, ...order });
    return acc;
  }, {});

  // 날짜 기준으로 리스트 변환
  const groupedDateList = Object.entries(groupedOrders);

  //0417 일주일이라는 기한 주기
  const isWithinWeek = (orderDate) => {
    const now = new Date();
    const orderDateObj = new Date(orderDate);
    const timeDifference = now - orderDateObj; // 밀리초 단위로 차이 계산
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // 일주일을 밀리초로 변환

    return timeDifference <= oneWeekInMs; // 일주일 이내면 true 반환
  };

  // 페이지네이션
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const paginatedGroups = groupedDateList.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(groupedDateList.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    // <div className="flex justify-end ml-20 h-auto select-none">
    <div className="flex justify-end ml-[1rem] mt-[0.5rem] min-h-[85vh] select-none">
      <div className="bg-white p-8 rounded-lg shadow-lg mt-20 w-full max-w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4 select-none border-gray-200">
          주문 내역
        </h2>
        {orders && orders.length > 0 && (
          <div className="text-orange-700 text-sm rounded-md border-orange-200 mb-6">
            상품 리뷰 작성 및 환불 요청은 <strong>구매일 기준 7일 이내</strong>
            에만 가능합니다.
          </div>
        )}
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {!orders || orders.length === 0 ? (
              <div className="h-[656px]">
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-center select-none text-lg">
                    주문 내역이 없습니다.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {paginatedGroups.map(([date, orders]) => (
                  <div key={date} className="mb-8">
                    {/* 날짜 표시 */}
                    <div className="mb-4">
                      <div className="text-xl font-bold text-gray-700 border-l-4 border-orange-400 pl-3">
                        {date}
                      </div>
                    </div>

                    {/* 각 주문별로 개별적으로 표시 */}
                    {orders.map((order) => (
                      <div
                        key={order.orderNo}
                        className="mb-6 border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow duration-200"
                      >
                        {/* 주문 상태와 주문번호 */}
                        <div className="flex justify-between items-center mb-3">
                          <div
                            className={`flex items-center text-sm font-semibold px-3 py-1 ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusText(order.status)}
                          </div>
                          <div className="text-gray-500 text-sm">
                            주문번호:{" "}
                            <span className="text-gray-500">
                              {order.orderNo}
                            </span>
                          </div>
                        </div>

                        {/* 주문 상품 리스트 */}
                        {order.orderItems.map((item, index) => (
                          <div key={index}>
                            {/* 상품 사이에 구분선 추가 (첫 번째 상품 제외) */}
                            {index > 0 && (
                              <div className="border-b my-3 mt-2 mb-6"></div>
                            )}

                            <div className="flex items-start mt-2 p-3 rounded-md">
                              {/* 환불 상태 리본 표시 */}
                              {item.refundStatus && (
                                <div
                                  className={`absolute -ml-2 -mt-6 px-3 py-1 rounded-full 
                                  ${getRefundStyle(item.refundStatus)?.bgColor} 
                                  ${
                                    getRefundStyle(item.refundStatus)?.textColor
                                  } 
                                  border ${
                                    getRefundStyle(item.refundStatus)
                                      ?.borderColor
                                  }
                                  flex items-center text-xs font-bold shadow-sm`}
                                >
                                  {getRefundStyle(item.refundStatus)?.icon}
                                  {getRefundStyle(item.refundStatus)?.text}
                                </div>
                              )}

                              <div className="flex-shrink-0 mr-5">
                                <div
                                  className={`w-36 h-36 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden shadow-sm
                                  ${
                                    item.refundStatus === "COMPLETE"
                                      ? "opacity-60"
                                      : ""
                                  }`}
                                >
                                  <img
                                    src={
                                      item.imgFileName
                                        ? `http://localhost:8089/product/view/s_${item.imgFileName}`
                                        : "/images/defalt.jpg"
                                    }
                                    alt={item.productName}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                </div>
                              </div>
                              <div
                                className={`flex-1 ${
                                  item.refundStatus === "COMPLETE"
                                    ? "opacity-75"
                                    : ""
                                }`}
                              >
                                <div className="font-bold text-xl mb-2 text-gray-800 flex items-center">
                                  <Link
                                    to={`/product/read/${item.pno}`}
                                    className="text-black hover:text-orange-400"
                                  >
                                    {item.productName}
                                  </Link>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center text-gray-600 mb-3">
                                  <div className="text-sm flex items-center">
                                    <span>{item.numOfItem}개</span>
                                  </div>
                                  <span className="hidden md:block mx-2 text-gray-300">
                                    {" "}
                                    ❙{" "}
                                  </span>
                                  <div className="text-sm flex items-center mt-1 md:mt-0">
                                    <span className="font-medium">
                                      {(() => {
                                        // 가격 문자열에서 숫자 부분만 추출
                                        const price = parseInt(
                                          item.productPrice.replace(
                                            /[^0-9]/g,
                                            ""
                                          ),
                                          10
                                        );
                                        const totalPrice =
                                          price * item.numOfItem;
                                        return (
                                          totalPrice.toLocaleString() + "원"
                                        ); // 계산 후 원화 표시
                                      })()}
                                    </span>
                                  </div>
                                </div>

                                <div className="text-sm text-gray-600">
                                  {order.shippingNum ? (
                                    <>
                                      운송장 번호:{" "}
                                      <span className="font-medium">
                                        {order.shippingNum}
                                      </span>
                                    </>
                                  ) : (
                                    "상품 배송 준비 중"
                                  )}
                                </div>

                                <div className="flex flex-col mt-4">
                                  {/* 리뷰 등록 버튼 */}
                                  {order.status === "DELIVERED" &&
                                    item.refundStatus === null &&
                                    !item.hasReview &&
                                    isWithinWeek(order.orderDate) && (
                                      <div className="flex justify-end mb-2">
                                        <button
                                          className="px-2 py-1 text-sm text-orange-500 bg-orange-100 rounded-lg hover:bg-orange-500 hover:text-white transition-colors "
                                          onClick={() =>
                                            handleReviewClick(item)
                                          }
                                        >
                                          리뷰 등록
                                        </button>
                                      </div>
                                    )}

                                  {/* 주문 취소 버튼 또는 환불 불가능 메시지 */}
                                  <div className="flex justify-end">
                                    {item.refundStatus === null &&
                                    isWithinWeek(order.orderDate) ? (
                                      <button
                                        className="px-2 py-1 text-sm text-red-500 bg-red-200 rounded-lg hover:bg-red-500 hover:text-white transition-colors active:scale-105"
                                        onClick={(e) =>
                                          handleCancelClick(
                                            e,
                                            item.pno,
                                            item.realOrderNum
                                          )
                                        }
                                      >
                                        주문 취소
                                      </button>
                                    ) : !item.refundStatus &&
                                      !isWithinWeek(order.orderDate) ? (
                                      <div className="text-sm text-gray-500 italic">
                                        환불 불가능 (기간 만료)
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    {/* 이전 페이지 그룹으로 이동하는 버튼 */}
                    {currentPage > 5 && (
                      <button
                        onClick={() =>
                          paginate(Math.floor((currentPage - 1) / 5) * 5)
                        }
                        className="mx-1 px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                      >
                        &lt;
                      </button>
                    )}

                    {/* 현재 페이지 그룹에 속하는 페이지 버튼들 */}
                    {Array.from(
                      {
                        length: Math.min(
                          5,
                          totalPages - Math.floor((currentPage - 1) / 5) * 5
                        ),
                      },
                      (_, i) => Math.floor((currentPage - 1) / 5) * 5 + i + 1
                    ).map((number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`mx-1 px-4 py-2 rounded-md transition-colors duration-200 ${
                          currentPage === number
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {number}
                      </button>
                    ))}

                    {/* 다음 페이지 그룹으로 이동하는 버튼 */}
                    {Math.floor((currentPage - 1) / 5) * 5 + 5 < totalPages && (
                      <button
                        onClick={() =>
                          paginate(Math.floor((currentPage - 1) / 5) * 5 + 6)
                        }
                        className="mx-1 px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                      >
                        &gt;
                      </button>
                    )}
                  </div>
                )}
                <ReviewModal
                  isOpen={isReviewModalOpen}
                  onClose={() => setIsReviewModalOpen(false)}
                  item={selectedItem}
                  orderNo={selectedOrderNo}
                  onSuccess={handleReviewSuccess}
                />
                <CancelProductModal
                  isOpen={isCancelModalOpen}
                  onClose={() => setIsCancelModalOpen(false)}
                  pNo={cancelPno}
                  orderNo={cancelOrderNo}
                  uid={uid}
                  refreshData={refreshData}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPageOrders;
