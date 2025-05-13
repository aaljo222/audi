import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CancelTicketModal from "../customModal/CancelTicketModal";

const MyPageReservation = ({ reservation, refreshData, uid }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const reservationsPerPage = 2;
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  useEffect(() => {
    console.log("받은 예약 내역:", reservation);
  }, [reservation]);

  const formatReservationNumber = (paymentDate, ticketId) => {
    const date = new Date(paymentDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}${ticketId}`;
  };

  const sortedReservations = [...(reservation || [])].sort((a, b) => {
    const aNum = parseInt(formatReservationNumber(a.paymentDate, a.ticketId));
    const bNum = parseInt(formatReservationNumber(b.paymentDate, b.ticketId));
    return bNum - aNum;
  });

  const groupedReservations = sortedReservations.reduce((acc, item) => {
    const formattedDate = new Date(item.paymentDate)
      .toISOString()
      .split("T")[0];
    if (!acc[formattedDate]) acc[formattedDate] = [];
    acc[formattedDate].push(item);
    return acc;
  }, {});

  const groupedDateList = Object.entries(groupedReservations);
  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const paginatedGroups = groupedDateList.slice(
    indexOfFirstReservation,
    indexOfLastReservation
  );
  const totalPages = Math.ceil(groupedDateList.length / reservationsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getStatusText = (status) => {
    switch (status) {
      case "RESERVATION":
        return "예매 완료";
      case "CANCEL_COMPLETED":
        return "환불 처리 완료";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "RESERVATION":
        return "text-black";
      case "CANCEL_COMPLETED":
        return "text-green-600";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "RESERVATION":
        return (
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
              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
            />
          </svg>
        );
      case "CANCEL_COMPLETED":
        return (
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
        );
      default:
        return null;
    }
  };

  const getDeliveryMethod = (method) => {
    switch (method) {
      case "mail":
        return "우편 발송";
      case "phone":
        return "모바일 티켓";
      case "site":
        return "현장 수령";
      default:
        return method;
    }
  };

  const formatConcertTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const period = hours < 12 ? "오전" : "오후";
    const formattedHours = hours % 12 || 12;
    return `${year}.${month}.${day} ${period} ${formattedHours}:${minutes}`;
  };

  const Refundable = (concertStartTime) => {
    const now = new Date();
    const concertDate = new Date(concertStartTime);
    const deadline = new Date(concertDate);
    deadline.setDate(deadline.getDate() - 1);
    deadline.setHours(23, 59, 59, 999);
    return now <= deadline;
  };

  return (
    <div className="flex justify-end ml-[31rem] mt-[-2rem] min-h-[85vh] select-none">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full flex flex-col justify-between min-h-[779px]">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4 border-gray-200">
            예매 내역
          </h2>

          {!reservation || reservation.length === 0 ? (
            <div className="text-center text-gray-600 py-12 text-lg">
              예매 내역이 없습니다.
            </div>
          ) : (
            <>
              {paginatedGroups.map(([date, items]) => (
                <div key={date} className="mb-8">
                  <div className="mb-4 text-xl font-bold text-gray-700 border-l-4 border-orange-400 pl-3">
                    {new Date(date)
                      .toLocaleDateString("ko-KR")
                      .replace(/\. /g, "-")
                      .replace(".", "")}
                  </div>

                  {items.map((item) => (
                    <div
                      key={item.ticketId}
                      className="mb-6 border border-gray-200 p-5 rounded-lg hover:shadow-md transition-shadow duration-200 bg-white"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div
                          className={`flex items-center text-sm font-semibold px-3 py-1 ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {getStatusIcon(item.status)}
                          {getStatusText(item.status)}
                        </div>
                        <div className="text-gray-500 text-sm">
                          예매번호:{" "}
                          {formatReservationNumber(
                            item.paymentDate,
                            item.ticketId
                          )}
                        </div>
                      </div>

                      <div className="flex items-start mt-2 p-3 rounded-md">
                        <div className="w-32 h-44 mr-5 bg-gray-100 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                          {item.posterImageUrl ? (
                            <img
                              src={`http://localhost:8089/concert/view/s_${item.posterImageUrl}`}
                              alt="Poster"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>

                        <div
                          className={`flex-1 ${
                            item.status !== "RESERVATION" ? "opacity-55" : ""
                          }`}
                        >
                          <div className="font-bold text-xl mb-2 text-gray-800">
                            <Link
                              to={`/reservation/read/${item.cno}`}
                              className="hover:text-orange-400"
                            >
                              {item.concertName}
                            </Link>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            {item.concertPlace}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            {formatConcertTime(item.concertStartTime)}
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            예매 수량: {item.ticketQuantity}매
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            총 결제 금액:{" "}
                            {parseInt(
                              item.price.replace(/[^\d]/g, "")
                            ).toLocaleString()}
                            원
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            티켓 수령 방법:{" "}
                            {getDeliveryMethod(item.deliveryMethod)}
                          </div>

                          <div className="flex justify-end mt-4">
                            {item.status === "RESERVATION" &&
                            Refundable(item.concertStartTime) ? (
                              <button
                                onClick={() => {
                                  setSelectedTicket(item);
                                  setIsCancelModalOpen(true);
                                }}
                                className="px-2 py-1 text-sm text-red-500 bg-red-200 rounded-lg hover:bg-red-500 hover:text-white transition"
                              >
                                예매 취소
                              </button>
                            ) : item.status === "RESERVATION" ? (
                              <span className="text-sm text-gray-500 italic">
                                환불 불가능 (기간 만료)
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
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

        {/* ✅ 예매 취소 모달 */}
        <CancelTicketModal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          ticketId={selectedTicket?.ticketId}
          refreshData={refreshData}
          uid={uid}
        />
      </div>
    </div>
  );
};

export default MyPageReservation;
