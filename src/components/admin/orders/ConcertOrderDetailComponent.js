import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getConcertDetail, modifyConcertTicket } from "../../../api/adminApi";

const ConcertOrderDetailComponent = () => {
  const { ticketNum } = useParams();
  const navigate = useNavigate();
  const [ticketDetail, setTicketDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getConcertDetail(ticketNum)
      .then((res) => {
        setTicketDetail(res);
        setNewStatus(res.status || "RESERVATION");
        setTrackingNumber(res.trackingNumber || "");
        setLoading(false);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [ticketNum]);

  // 상태 텍스트 변환
  const getStatusText = (status) => {
    switch (status) {
      case "RESERVATION":
        return "예약완료";
      case "TICKETING_COMPLETED":
        return "발권완료";
      case "CANCEL_COMPLETED":
        return "취소된 티켓";
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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // 시간 포맷팅
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  };

  // 수정 모드 전환
  const handleEdit = () => {
    setIsEditing(true);
  };

  // 취소
  const handleCancel = () => {
    setIsEditing(false);
    setNewStatus(ticketDetail.status || "RESERVATION");
    setTrackingNumber(ticketDetail.trackingNumber || "");
  };

  // 저장
  const handleSave = () => {
    // 업데이트할 데이터 구성
    const updateData = {
      id: ticketDetail.id,
      status: newStatus,
      trackingNumber:
        ticketDetail.deliveryMethod === "mail" ? trackingNumber : null,
    };
    console.log("업데이트할 데이터:", updateData);
    modifyConcertTicket(updateData)
      .then((data) => {
        alert(data);
        navigate(-1);
      })
      .catch((err) => {
        console.log("에러", err);
        alert("공연정보 업데이트중 오류");
      });

    setIsEditing(false);
  };

  // 목록으로 돌아가기
  const handleBackToList = () => {
    navigate(-1);
  };

  if (loading) {
    return <div className="flex justify-center p-8">로딩 중...</div>;
  }

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          공연 예매 상세 정보
        </h1>
        <button
          onClick={handleBackToList}
          className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition duration-200 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          목록으로
        </button>
      </div>

      {/* 예매 기본 정보 */}
      <div className="mb-8 bg-white p-5 rounded-lg border-l-4 border-blue-500 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-blue-700 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          예매 정보
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600 mb-1">예매 번호</p>
            <p className="font-medium text-gray-800">{ticketDetail.id}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600 mb-1">상태</p>
            <p>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColorClass(
                  ticketDetail.status
                )}`}
              >
                {getStatusText(ticketDetail.status)}
              </span>
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600 mb-1">결제 일자</p>
            <p className="font-medium text-gray-800">
              {formatDate(ticketDetail.paymentDate)}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600 mb-1">티켓 수량</p>
            <p className="font-medium text-gray-800">
              {ticketDetail.ticketQuantity}매
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600 mb-1">결제 방법</p>
            <p className="font-medium text-gray-800">
              {ticketDetail.buyMethod}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600 mb-1">결제 금액</p>
            <p className="font-medium text-gray-800">{ticketDetail.price}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600 mb-1">배송 방법</p>
            <p className="font-medium text-gray-800">
              {ticketDetail.deliveryMethod === "phone"
                ? "모바일 티켓"
                : ticketDetail.deliveryMethod === "mail"
                ? "우편 배송"
                : ticketDetail.deliveryMethod === "site"
                ? "현장발권"
                : ticketDetail.deliveryMethod}
            </p>
          </div>
          {ticketDetail.deliveryMethod === "mail" && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600 mb-1">운송장 번호</p>
              <p className="font-medium text-gray-800">
                {ticketDetail.trackingNumber || "미등록"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 공연 정보 */}
      {ticketDetail.scheduleDTO && (
        <div className="mb-8 bg-white p-5 rounded-lg border-l-4 border-purple-500 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-purple-700 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            공연 정보
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600 mb-1">공연명</p>
              <p className="font-medium text-gray-800">
                {ticketDetail.concertName || "-"}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600 mb-1">공연 스케줄 ID</p>
              <p className="font-medium text-gray-800">
                {ticketDetail.scheduleDTO.scheduleId}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600 mb-1">공연 날짜</p>
              <p className="font-medium text-gray-800">
                {formatDate(ticketDetail.scheduleDTO.startTime)}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600 mb-1">공연 시간</p>
              <p className="font-medium text-gray-800">
                {formatTime(ticketDetail.scheduleDTO.startTime)} ~{" "}
                {formatTime(ticketDetail.scheduleDTO.endTime)}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600 mb-1">총 좌석</p>
              <p className="font-medium text-gray-800">
                {ticketDetail.scheduleDTO.totalSeats}석
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 회원 정보 */}
      {ticketDetail.userDTO && (
        <div className="mb-8 bg-white p-5 rounded-lg border-l-4 border-green-500 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-green-700 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            회원 정보
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600 mb-1">회원 ID</p>
              <p className="font-medium text-gray-800">
                {ticketDetail.userDTO.userId}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600 mb-1">회원 이름</p>
              <p className="font-medium text-gray-800">
                {ticketDetail.userDTO.userName}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600 mb-1">이메일</p>
              <p className="font-medium text-gray-800">
                {ticketDetail.userDTO.userEmail}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600 mb-1">주소</p>
              <p className="font-medium text-gray-800">
                {ticketDetail.userDTO.userAdress}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 구매자 정보 */}
      <div className="mb-8 bg-white p-5 rounded-lg border-l-4 border-yellow-500 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-yellow-700 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          티켓 사용자 정보
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600 mb-1">사용자 이름</p>
            <p className="font-medium text-gray-800">
              {ticketDetail.buyerName}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600 mb-1">연락처</p>
            <p className="font-medium text-gray-800">{ticketDetail.buyerTel}</p>
          </div>
          {ticketDetail.shippingAddress && (
            <div className="col-span-2 bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600 mb-1">배송 주소</p>
              <p className="font-medium text-gray-800">
                {ticketDetail.shippingAddress}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 티켓 상태 관리 */}
      <div className="bg-indigo-50 p-6 rounded-lg shadow border border-indigo-100">
        <h2 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          상태 관리
        </h2>
        {isEditing ? (
          <div className="space-y-4 bg-white p-4 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                티켓 상태 변경
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition duration-200"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="RESERVATION">예약완료</option>
                <option value="TICKETING_COMPLETED">발권완료</option>
                <option value="CANCEL_COMPLETED">취소된 티켓</option>
              </select>
            </div>

            {ticketDetail.deliveryMethod === "mail" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  운송장 번호
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition duration-200"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="운송장 번호 입력"
                />
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleSave}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition duration-200 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
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
                저장
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg transition duration-200 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
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
                취소
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleEdit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg transition duration-200 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            상태 변경
          </button>
        )}
      </div>
    </div>
  );
};

export default ConcertOrderDetailComponent;
