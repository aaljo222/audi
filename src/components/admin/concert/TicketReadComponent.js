import React, { useState, useEffect } from "react";

const TicketReadComponent = () => {
  const [tickets, setTickets] = useState([]);

  // 컴포넌트가 마운트될 때 localStorage에서 티켓 데이터를 읽어옴
  useEffect(() => {
    const storedTickets = JSON.parse(localStorage.getItem("ticketList")) || [];
    setTickets(storedTickets);
  }, []);

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">티켓 목록</h1>
      {tickets.length === 0 ? (
        <p className="text-center">등록된 티켓이 없습니다.</p>
      ) : (
        <div className="space-y-6">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="border p-4 rounded">
              <h2 className="text-xl font-bold mb-2">
                {ticket.performanceTitle}
              </h2>
              <p>
                <strong>주요 아티스트:</strong> {ticket.featuredArtist}
              </p>
              <p>
                <strong>공연 장소:</strong> {ticket.performanceVenue}
              </p>
              <p>
                <strong>공연 날짜:</strong> {ticket.performanceDate}
              </p>
              <p>
                <strong>티켓 배송 방법:</strong> {ticket.ticketDelivery}
              </p>
              <p>
                <strong>상영 시간:</strong> {ticket.runningTime}
              </p>
              <p>
                <strong>관람 연령:</strong> {ticket.viewingAge}
              </p>
              <p>
                <strong>티켓 가격:</strong> {ticket.ticketPrice}
              </p>
              <p>
                <strong>예약 시작일:</strong> {ticket.reservationStartDate}
              </p>
              <p>
                <strong>예약 종료일:</strong> {ticket.reservationEndDate}
              </p>
              {ticket.performancePosterImage && (
                <div className="mt-2">
                  <img
                    src={ticket.performancePosterImage}
                    alt="공연 포스터"
                    className="w-full h-55 object-contain rounded"
                  />
                </div>
              )}
              {ticket.performanceArtistImage && (
                <div className="mt-2">
                  <img
                    src={ticket.performanceArtistImage}
                    alt="공연 아티스트"
                    className="w-full h-55 object-contain rounded"
                  />
                </div>
              )}
              <p>
                <strong>공연 설명:</strong> {ticket.performanceDescription}
              </p>
              <p>
                <strong>공연 공지:</strong> {ticket.performanceNotice}
              </p>
              <p>
                <strong>공연 캐스팅:</strong> {ticket.performanceCast}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketReadComponent;
