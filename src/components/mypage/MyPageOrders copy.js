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

  const getRefundStyle = (refundStatus) => {
    switch (refundStatus) {
      case "WAITING":
        return {
          bgColor: "bg-yellow-50",
          textColor: "text-yellow-600",
          icon: (
            <svg
              className="h-5 w-5 mr-1"
              viewBox="0 0 24 24"
              fill="none"
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
              className="h-5 w-5 mr-1"
              viewBox="0 0 24 24"
              fill="none"
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
              className="h-5 w-5 mr-1"
              viewBox="0 0 24 24"
              fill="none"
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

  const isWithinWeek = (orderDate) => {
    const now = new Date();
    const orderDateObj = new Date(orderDate);
    const timeDifference = now - orderDateObj;
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
    return timeDifference <= oneWeekInMs;
  };

  useEffect(() => {
    console.log("받은 주문 내역:", orders);
  }, [orders]);

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
  );

  const groupedOrders = sortedOrders.reduce((acc, order) => {
    const { date, time } = formatOrderDate(order.orderDate);
    if (!acc[date]) acc[date] = [];
    acc[date].push({ time, ...order });
    return acc;
  }, {});

  const groupedDateList = Object.entries(groupedOrders);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const paginatedGroups = groupedDateList.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(groupedDateList.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex justify-end ml-[31rem] mt-[-2rem] min-h-[85vh] select-none">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full flex flex-col justify-between min-h-[779px]">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4 select-none border-gray-200">
            주문 내역
          </h2>

          <div className="overflow-x-auto">
            <div className="min-w-full">
              {!orders || orders.length === 0 ? (
                <div className="text-center text-gray-600 py-12 select-none text-lg">
                  주문 내역이 없습니다.
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

                      {/* 주문별 표시 */}
                      {orders.map((order) => (
                        <div
                          key={order.orderNo}
                          className="mb-6 border border-gray-200 p-5 rounded-lg hover:shadow-md transition-shadow duration-200"
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
                              주문번호: <span>{order.orderNo}</span>
                            </div>
                          </div>

                          {/* 주문 상품들 */}
                          {order.orderItems.map((item, index) => (
                            <div key={index}>
                              {index > 0 && (
                                <div className="border-b my-3"></div>
                              )}

                              <div className="flex items-start mt-2 p-3 rounded-md relative">
                                {/* 환불 상태 리본 */}
                                {item.refundStatus && (
                                  <div
                                    className={`absolute -ml-2 -mt-6 px-3 py-1 rounded-full 
                                      ${
                                        getRefundStyle(item.refundStatus)
                                          ?.bgColor
                                      } 
                                      ${
                                        getRefundStyle(item.refundStatus)
                                          ?.textColor
                                      } 
                                      border flex items-center text-xs font-bold shadow-sm`}
                                  >
                                    {getRefundStyle(item.refundStatus)?.icon}
                                    {getRefundStyle(item.refundStatus)?.text}
                                  </div>
                                )}

                                <div className="flex-shrink-0 mr-5">
                                  <div
                                    className={`w-36 h-36 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden shadow-sm ${
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
                                      className="w-full h-full object-cover"
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
                                  <div className="font-bold text-xl mb-2 text-gray-800">
                                    <Link
                                      to={`/product/read/${item.pno}`}
                                      className="text-black hover:text-orange-400"
                                    >
                                      {item.productName}
                                    </Link>
                                  </div>

                                  <div className="flex flex-col md:flex-row md:items-center text-gray-600 mb-3">
                                    <div className="text-sm">
                                      {item.numOfItem}개
                                    </div>
                                    <span className="hidden md:block mx-2 text-gray-300">
                                      ❙
                                    </span>
                                    <div className="text-sm font-medium">
                                      {(() => {
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
                                        );
                                      })()}
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

                                  {/* 버튼 영역 */}
                                  <div className="flex flex-col mt-4">
                                    {order.status === "DELIVERED" &&
                                      item.refundStatus === null &&
                                      !item.hasReview &&
                                      isWithinWeek(order.orderDate) && (
                                        <div className="flex justify-end mb-2">
                                          <button
                                            className="px-2 py-1 text-sm text-orange-500 bg-orange-100 rounded-lg hover:bg-orange-500 hover:text-white"
                                            onClick={() =>
                                              handleReviewClick(item)
                                            }
                                          >
                                            리뷰 등록
                                          </button>
                                        </div>
                                      )}
                                    <div className="flex justify-end">
                                      {item.refundStatus === null &&
                                      isWithinWeek(order.orderDate) ? (
                                        <button
                                          className="px-2 py-1 text-sm text-red-500 bg-red-200 rounded-lg hover:bg-red-500 hover:text-white"
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
                </>
              )}
            </div>
          </div>
        </div>

        {/* ✅ 하단에 고정된 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-auto pt-8">
            {currentPage > 5 && (
              <button
                onClick={() => paginate(Math.floor((currentPage - 1) / 5) * 5)}
                className="mx-1 px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                &lt;
              </button>
            )}

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

            {Math.floor((currentPage - 1) / 5) * 5 + 5 < totalPages && (
              <button
                onClick={() =>
                  paginate(Math.floor((currentPage - 1) / 5) * 5 + 6)
                }
                className="mx-1 px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                &gt;
              </button>
            )}
          </div>
        )}

        {/* 모달들 */}
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
      </div>
    </div>
  );
};

export default MyPageOrders;
