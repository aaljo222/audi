import React, { useEffect, useState } from "react";
import { getConcertTicketList } from "../../../api/adminApi";
import { useNavigate } from "react-router-dom";

const ConcertOrderComponent = () => {
  const [ticketList, setTicketList] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("전체");
  const navigate = useNavigate();

  useEffect(() => {
    getConcertTicketList().then((data) => {
      setTicketList(data);
      setFilteredTickets(data);
      console.log(data);
    });
  }, []);

  useEffect(() => {
    // 상태 필터링
    if (statusFilter === "전체") {
      setFilteredTickets(ticketList); // "전체"일 경우 모든 데이터 표시
    } else {
      setFilteredTickets(
        ticketList.filter((ticket) => ticket.status === statusFilter)
      );
    }
  }, [statusFilter, ticketList]);

  // 상태 텍스트 변환
  const getStatusText = (status) => {
    switch (status) {
      case "RESERVATION":
        return "예약완료";
      case "TICKETING_COMPLETED":
        return "발권완료";
      case "CANCEL_REQUEST":
        return "예약취소요청";
      case "CANCEL_COMPLETED":
        return "예약취소완료";
      case "REJECTED":
        return "예약 취소 거절";
      default:
        return status;
    }
  };

  // 상태 색상 클래스
  const getStatusColorClass = (status) => {
    switch (status) {
      case "RESERVATION":
        return "bg-blue-100 text-blue-800";
      case "CANCEL_COMPLETED":
        return "bg-red-100 text-red-800";
      case "TICKETING_COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCEL_REQUEST":
        return "bg-yellow-100 text-yellow-800";
      case "REJECTED":
        return "bg-purple-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 날짜 형식 변환 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // 티켓 상세 페이지로 이동
  const handleTicketDetail = (id) => {
    navigate(`/admin/concert/order/detail/${id}`);
  };

  return (
    <div className="w-full bg-white p-4 rounded shadow">
      <h1 className="text-xl font-bold mb-4">공연 예약 관리</h1>

      <div className="mb-4">
        <select
          className="px-4 py-2 border rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="전체">전체</option>
          <option value="RESERVATION">예약완료</option>
          <option value="TICKETING_COMPLETED">발권완료</option>
          <option value=" CANCEL_REQUEST">예약 취소 요청</option>
          <option value="CANCEL_COMPLETED">예약 취소 완료</option>
          <option value="REJECTED">예약 취소 거절</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">예약번호</th>
              <th className="py-2 px-4 text-left">회원번호</th>
              <th className="py-2 px-4 text-left">공연명</th>
              <th className="py-2 px-4 text-left">예약상태</th>
              <th className="py-2 px-4 text-left">결제일시</th>
              <th className="py-2 px-4 text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{ticket.id}</td>
                <td className="py-2 px-4">{ticket.uid}</td>
                <td className="py-2 px-4">{ticket.cname}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColorClass(
                      ticket.status
                    )}`}
                  >
                    {getStatusText(ticket.status)}
                  </span>
                </td>
                <td className="py-2 px-4">{formatDate(ticket.payment_date)}</td>
                <td className="py-2 px-4">
                  <div className="flex justify-center items-center h-full">
                    <button
                      onClick={() => handleTicketDetail(ticket.id)}
                      className="bg-teal-500 hover:bg-teal-600 text-white py-1 px-3 rounded text-sm"
                    >
                      상세보기
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ticketList.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          등록된 예약이 없습니다
        </div>
      )}
    </div>
  );
};

export default ConcertOrderComponent;
