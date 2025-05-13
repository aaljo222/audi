import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CancelTicketModal from "../customModal/CancelTicketModal";

const MyPageReservation = ({ reservation, refreshData, uid }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const reservationsPerPage = 2;
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [cancelingTickets, setCancelingTickets] = useState([]);

  // 취소 모달 상태 관리
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  useEffect(() => {
    console.log("받은 예약 내역:", reservation);
  }, [reservation]);

  // 예매번호 포맷 함수
  const formatReservationNumber = (paymentDate, ticketId) => {
    const date = new Date(paymentDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}${month}${day}${ticketId}`;
  };

  // 예매 번호 기준 최신순 정렬
  const sortedReservations = [...(reservation || [])].sort((a, b) => {
    const aNum = parseInt(
      formatReservationNumber(a.paymentDate, a.ticketId),
      10
    );
    const bNum = parseInt(
      formatReservationNumber(b.paymentDate, b.ticketId),
      10
    );
    return bNum - aNum;
  });

  // 날짜별 그룹화
  const groupedReservations = sortedReservations.reduce((acc, item) => {
    const formattedDate = new Date(item.paymentDate)
      .toISOString()
      .split("T")[0];
    if (!acc[formattedDate]) acc[formattedDate] = [];
    acc[formattedDate].push(item);
    return acc;
  }, {});

  // 날짜 기준으로 리스트 변환
  const groupedDateList = Object.entries(groupedReservations);

  // 페이지네이션
  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const paginatedGroups = groupedDateList.slice(
    indexOfFirstReservation,
    indexOfLastReservation
  );
  const totalPages = Math.ceil(groupedDateList.length / reservationsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 예약 상태 한글 변환
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

  // 예약 상태에 따른 텍스트 색상 클래스 반환
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

  // 환불 상태에 따른 아이콘
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

  //티켓 수령 방법 한글 변환
  const getdeliveryMethod = (deliveryMethod) => {
    switch (deliveryMethod) {
      case "mail":
        return "우편 발송";
      case "phone":
        return "모바일 티켓";
      case "site":
        return "현장 수령";
      default:
        return deliveryMethod;
    }
  };

  // 공연 시작 시간 포맷팅
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

  // 취소 버튼 클릭 핸들러
  const handleCancelClick = (ticket) => {
    setSelectedTicket(ticket);
    setIsCancelModalOpen(true);
  };

  //0421 환불 가능 기간은 공연 날짜 하루 전(23시 59분 59초)까지.
  const Refundable = (concertStartTime) => {
    const now = new Date();
    const concertDate = new Date(concertStartTime);

    // 공연 하루 전 23:59:59
    const deadline = new Date(concertDate);
    deadline.setDate(deadline.getDate() - 1); // 하루 전
    deadline.setHours(23, 59, 59, 999); // 23시 59분 59초

    return now <= deadline;
  };

  return (
    // <div className="flex justify-end ml-20 h-auto select-none">
    <div className="flex justify-end ml-[1rem] mt-[0.5rem] min-h-[85vh] select-none">
      <div className="bg-white p-8 rounded-lg shadow-lg mt-20 w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4 select-none border-gray-200">
          예매 내역
        </h2>

        {reservation && reservation.length > 0 && (
          <div className="text-orange-700 text-sm rounded-md border-orange-200 mb-6">
            예매 변경 및 환불은 <strong>관람일 1일 전</strong>까지 가능합니다.
          </div>
        )}
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {!reservation || reservation.length === 0 ? (
              <div className="h-[656px]">
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-center select-none text-lg">
                    예매 내역이 없습니다.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {paginatedGroups.map(([date, items]) => (
                  <div key={date} className="mb-8">
                    {/* 날짜 표시 */}
                    <div className="mb-4">
                      <div className="text-xl font-bold text-gray-700 border-l-4 border-orange-400 pl-3">
                        {new Date(date)
                          .toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })
                          .replace(/\. /g, "-")
                          .replace(".", "")}
                      </div>
                    </div>

                    {/* 각 예약별로 개별적으로 표시 */}
                    {items.map((item) => (
                      <div
                        key={item.ticketId}
                        className="mb-6 border p-5 rounded-lg hover:shadow-md transition-shadow duration-200"
                      >
                        {/* 상태와 예약번호를 항상 같은 위치에 표시 */}
                        <div className="flex justify-between items-center">
                          <div
                            className={`flex items-center text-sm font-semibold px-3 py-1 ${getStatusColor(
                              item.status
                            )}`}
                          >
                            {/* 상태 아이콘 추가 */}
                            {getStatusIcon(item.status)}
                            {getStatusText(item.status)}
                          </div>
                          {/* 예약번호 표시 */}
                          <div className="text-gray-500 text-sm">
                            예매번호:{" "}
                            <span className="text-gray-500">
                              {formatReservationNumber(
                                item.paymentDate,
                                item.ticketId
                              )}
                            </span>
                          </div>
                        </div>

                        {/* 예약 상세 정보 */}
                        <div className="flex items-start mt-2 p-3 rounded-md">
                          <div className="flex-shrink-0 mr-5">
                            <div
                              className={`w-32 h-44 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden shadow-sm
                              ${
                                item.status !== "RESERVATION"
                                  ? "opacity-55"
                                  : ""
                              }`}
                            >
                              {item.posterImageUrl ? (
                                // 이미지가 있을 경우
                                <img
                                  src={`http://localhost:8089/concert/view/s_${item.posterImageUrl}`}
                                  alt="Concert Poster"
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                // 이미지가 없을 경우
                                <svg
                                  className="w-24 h-24 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>

                          <div
                            className={`flex-1 ${
                              item.status !== "RESERVATION" ? "opacity-55" : ""
                            }`}
                          >
                            <div className="font-bold text-xl mb-2 text-gray-800">
                              <Link
                                to={`/reservation/read/${item.cno}`}
                                className="text-black hover:text-orange-400"
                              >
                                {item.concertName}
                              </Link>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center text-gray-600 mb-3">
                              <div className="text-sm flex items-center">
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                {item.concertPlace}
                              </div>
                              <span className="hidden md:block mx-2 text-gray-300">
                                {" "}
                                ❙{" "}
                              </span>
                              <div className="text-sm flex items-center mt-1 md:mt-0">
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {formatConcertTime(item.concertStartTime)}
                              </div>
                            </div>

                            <div className="flex justify-left items-center">
                              <div className="text-sm text-gray-600">
                                예매 수량:{" "}
                                <span className="font-medium">
                                  {item.ticketQuantity}매
                                </span>
                              </div>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600 text-sm mr-1">
                                총 결제 금액:
                              </span>
                              {parseInt(
                                item.price.replace(/[^\d]/g, "")
                              ).toLocaleString()}
                              원
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600 text-sm mr-1">
                                {" "}
                                티켓 수령 방법 :{" "}
                              </span>
                              {getdeliveryMethod(item.deliveryMethod)}
                            </div>

                            {/* 예매 취소 버튼 */}
                            <div className="flex justify-end mt-4">
                              {item.status === "RESERVATION" &&
                              Refundable(item.concertStartTime) ? (
                                <button
                                  onClick={() => handleCancelClick(item)}
                                  className="px-2 py-1 text-sm text-red-500 bg-red-200 rounded-lg hover:bg-red-500 hover:text-white transition-colors active:scale-105"
                                >
                                  예매 취소
                                </button>
                              ) : item.status === "RESERVATION" &&
                                !Refundable(item.concertStartTime) ? (
                                <div className="text-sm text-gray-500 italic">
                                  환불 불가능 (기간 만료)
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* 취소 모달 컴포넌트 */}
      <CancelTicketModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        ticketId={selectedTicket?.ticketId}
        refreshData={refreshData}
        uid={uid}
      />
    </div>
  );
};

export default MyPageReservation;
