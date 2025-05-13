import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getConcertByCnoAndDate } from "../../api/concertApi";
import MainMenubar from "../menu/MainMenubar";
import { addConcertOrder } from "../../api/userApi";
import AddressSearch from "../customModal/AddressSearch"; // AddressSearch 컴포넌트 임포트

const BookingPaymentComponent = () => {
  const loginUser = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const { cno } = useParams();
  const selectedSchedule = location.state?.schedule;
  const [concertData, setConcertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // 사용자 입력 필드
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("phone");
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [currentStep, setCurrentStep] = useState(1); // 결제 단계 추적

  // 결제 정보
  const [totalPrice, setTotalPrice] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  // 개인정보 수집 동의
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  // 주소 검색 모달 상태
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  useEffect(() => {
    if (selectedSchedule && cno) {
      setLoading(true);
      getConcertByCnoAndDate(cno, selectedSchedule.startTime)
        .then((data) => {
          console.log("데이터 수신 성공:", data);
          setConcertData(data);
          // 단가 설정
          const price = data.concertDTO.cprice
            ? parseInt(data.concertDTO.cprice.replace(/[^0-9]/g, ""))
            : 0;
          setUnitPrice(price);
          setTotalPrice(price * ticketQuantity);
          setLoading(false);
        })
        .catch((error) => {
          console.error("데이터 수신 실패:", error);
          setError("데이터를 불러오는 데 실패했습니다.");
          setLoading(false);
        });
    }
  }, [selectedSchedule, cno]);

  // 티켓 수량이 변경될 때마다 총 가격 업데이트
  useEffect(() => {
    setTotalPrice(unitPrice * ticketQuantity);
  }, [ticketQuantity, unitPrice]);

  const handleNameChange = (event) => {
    setCustomerName(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    // 전화번호 형식 자동 포맷팅 (000-0000-0000)
    const value = event.target.value.replace(/[^0-9]/g, "");
    let formattedValue = "";

    if (value.length <= 3) {
      formattedValue = value;
    } else if (value.length <= 7) {
      formattedValue = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else {
      formattedValue = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(
        7,
        11
      )}`;
    }

    setPhoneNumber(formattedValue);
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  // 주소 검색 모달 열기
  const handleAddressSearchClick = () => {
    setIsAddressModalOpen(true);
  };

  // 주소 선택 시 호출될 함수
  const handleAddressSelect = (selectedAddress) => {
    setAddress(selectedAddress);
    setIsAddressModalOpen(false);
  };

  const handleDeliveryMethodChange = (event) => {
    setDeliveryMethod(event.target.value);
  };

  const handlePrivacyAgreementChange = (event) => {
    setPrivacyAgreed(event.target.checked);
  };

  const handleTicketQuantityChange = (event) => {
    const quantity = parseInt(event.target.value);
    if (quantity > 0 && quantity <= 4) {
      // 최대 4장으로 제한
      setTicketQuantity(quantity);
    }
  };

  const incrementTicketQuantity = () => {
    if (ticketQuantity < 4) {
      // 최대 4장으로 제한
      setTicketQuantity((prev) => prev + 1);
    }
  };

  const decrementTicketQuantity = () => {
    if (ticketQuantity > 1) {
      setTicketQuantity((prev) => prev - 1);
    }
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleNextStep = () => {
    // 필수 필드 유효성 검사
    if (currentStep === 1) {
      // 간단한 유효성 검사
      if (ticketQuantity < 1 || ticketQuantity > 4) {
        alert("티켓 수량은 1~4매 사이여야 합니다.");
        return;
      }
      // 남은 좌석 확인 (추가된 부분)
      if (concertData.availableSeats < ticketQuantity) {
        alert(
          `남은 좌석이 부족합니다. 현재 예매 가능한 좌석은 ${concertData.availableSeats}석입니다.`
        );
        return;
      }
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentStep === 2) {
      // 필수 필드 검증
      if (!customerName.trim()) {
        alert("이름을 입력해주세요.");
        return;
      }

      if (!phoneNumber.trim()) {
        alert("전화번호를 입력해주세요.");
        return;
      }

      if (deliveryMethod === "mail" && !address.trim()) {
        alert("우편물 수령 시 주소를 입력해주세요.");
        return;
      }

      if (!privacyAgreed) {
        alert("개인정보 수집 및 이용에 동의해주세요.");
        return;
      }

      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      alert("결제 수단을 선택해주세요.");
      return;
    }
    console.log(concertData.scheduleId);
    const imp = window.IMP; // 아이엠포트 객체

    imp.init("imp82633673");

    imp.request_pay(
      {
        pg: "mobilians",
        pay_method: selectedPaymentMethod,
        name: `${concertData.concertDTO.cname} 티켓`,
        amount: deliveryMethod === "mail" ? totalPrice + 3000 : totalPrice,
        buyer_name: customerName,
        buyer_tel: phoneNumber,
        buyer_addr: address,
        custom_data: {
          scheduleId: concertData.scheduleId,
          ticketQuantity: ticketQuantity,
          deliveryMethod: deliveryMethod,
          uid: loginUser.uid,
        },
      },
      function (rsp) {
        if (rsp.success) {
          addConcertOrder(rsp.imp_uid)
            .then((i) => {
              alert(i);
              navigate(`/member/mypage/${loginUser.userId}`);
            })
            .catch((error) => {
              const errorMessage =
                error.response?.data ||
                error.message ||
                "알 수 없는 오류가 발생했습니다";
              alert(errorMessage);
              navigate("/");
            });
        } else {
          alert("결제에 실패하였습니다. 실패 사유: " + rsp.error_msg);
        }
      }
    );
  };

  // 날짜 및 시간 포맷팅 함수
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
  };

  // 요일 구하기
  const getDayOfWeek = (dateTimeString) => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return days[date.getDay()];
  };

  // 가격 포맷팅 함수
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <MainMenubar />
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-400 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-700 font-medium">
            예매 정보를 불러오는 중입니다...
          </p>
          <p className="mt-2 text-gray-500">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <MainMenubar />
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-2xl text-red-600 font-bold mb-4">
            오류가 발생했습니다
          </p>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-400 hover:bg-orange-500 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-md"
          >
            다시 시도하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainMenubar />

      {/* MenuBar의 크기(h-[10vh])를 고려하여 상단 마진을 추가 */}
      <div className="pt-[10vh] max-w-6xl mx-auto px-4">
        <div className="flex gap-8">
          {/* 왼쪽 사이드바 - 세로 프로그레스 바 */}
          <div className="w-1/5 relative">
            <div className="sticky top-[15vh] transform translate-y-[10vh]">
              <h1 className="text-2xl font-bold text-orange-400 mb-8 text-center">
                예매 및 결제
              </h1>

              <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
                {/* 단계 1 */}
                <div className="w-full flex items-center mb-2">
                  <div
                    className={`w-10 h-10 rounded-full ${
                      currentStep >= 1 ? "bg-orange-400" : "bg-gray-300"
                    } flex items-center justify-center text-white font-bold`}
                  >
                    1
                  </div>
                  <div className="ml-3">
                    <span
                      className={`font-medium ${
                        currentStep >= 1 ? "text-orange-400" : "text-gray-400"
                      }`}
                    >
                      티켓 선택
                    </span>
                  </div>
                </div>

                {/* 연결선 */}
                <div
                  className={`w-1 h-12 ${
                    currentStep >= 2 ? "bg-orange-400" : "bg-gray-300"
                  }`}
                ></div>

                {/* 단계 2 */}
                <div className="w-full flex items-center mb-2">
                  <div
                    className={`w-10 h-10 rounded-full ${
                      currentStep >= 2 ? "bg-orange-400" : "bg-gray-300"
                    } flex items-center justify-center text-white font-bold`}
                  >
                    2
                  </div>
                  <div className="ml-3">
                    <span
                      className={`font-medium ${
                        currentStep >= 2 ? "text-orange-400" : "text-gray-400"
                      }`}
                    >
                      예매정보 입력
                    </span>
                  </div>
                </div>

                {/* 연결선 */}
                <div
                  className={`w-1 h-12 ${
                    currentStep >= 3 ? "bg-orange-400" : "bg-gray-300"
                  }`}
                ></div>

                {/* 단계 3 */}
                <div className="w-full flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full ${
                      currentStep >= 3 ? "bg-orange-400" : "bg-gray-300"
                    } flex items-center justify-center text-white font-bold`}
                  >
                    3
                  </div>
                  <div className="ml-3">
                    <span
                      className={`font-medium ${
                        currentStep >= 3 ? "text-orange-400" : "text-gray-400"
                      }`}
                    >
                      결제하기
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 중앙 및 오른쪽 - 콘텐츠 영역 */}
          <div className="w-4/5 pl-6 mt-16">
            {/* 콘서트 정보 카드 */}
            {concertData && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4 ">
                  공연 정보
                </h1>
                <hr className="border-t border-gray-300 mb-6" />

                <div className="flex flex-col md:flex-row">
                  {/* 콘서트 이미지 */}
                  <div className="md:w-1/4 mb-4 md:mb-0">
                    <img
                      src={
                        !concertData.concertDTO.uploadFileName
                          ? "/images/defalt.png"
                          : `http://localhost:8089/concert/view/s_${concertData.concertDTO.uploadFileName}`
                      }
                      alt={concertData.concertDTO.cname}
                      className="w-full h-auto rounded"
                    />
                  </div>

                  {/* 콘서트 상세 정보 */}
                  <div className="md:w-3/4 md:pl-6">
                    <h2 className="text-xl font-bold mb-4">
                      {concertData.concertDTO.cname}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600">공연 장소</p>
                        <p className="font-medium">
                          {concertData.concertDTO.cplace}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-600">공연 일시</p>
                        <p className="font-medium">
                          {formatDateTime(concertData.startTime)} (
                          {getDayOfWeek(concertData.startTime)})
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-600">가격</p>
                        <p className="font-medium">{formatPrice(unitPrice)}</p>
                      </div>

                      <div>
                        <p className="text-gray-600">좌석 정보</p>
                        <p className="font-medium">
                          {concertData.availableSeats}/{concertData.totalSeats}
                          석
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 단계별 컨텐츠 */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">티켓 선택</h3>

                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <button
                      onClick={decrementTicketQuantity}
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={ticketQuantity}
                      onChange={handleTicketQuantityChange}
                      className="mx-4 w-16 text-center p-2 border rounded"
                    />
                    <button
                      onClick={incrementTicketQuantity}
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                    >
                      +
                    </button>
                    <span className="ml-4 text-gray-600">
                      1인당 최대 4매까지 구매 가능
                    </span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded">
                    <div className="flex justify-between mb-2">
                      <span>티켓 단가</span>
                      <span>{formatPrice(unitPrice)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>수량</span>
                      <span>{ticketQuantity}매</span>
                    </div>
                    <div className="flex justify-between font-bold text-orange-500 mt-2 pt-2 border-t border-gray-300">
                      <span>총 금액</span>
                      <span>
                        {formatPrice(unitPrice)} × {ticketQuantity} ={" "}
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    onClick={handleNextStep}
                    className="bg-orange-400 text-white px-6 py-2 rounded"
                  >
                    다음 단계로
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">예매자 정보</h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block mb-1">
                      이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={handleNameChange}
                      className="w-full p-2 border rounded"
                      placeholder="예매자 이름"
                    />
                  </div>

                  <div>
                    <label className="block mb-1">
                      전화번호 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      className="w-full p-2 border rounded"
                      placeholder="010-0000-0000"
                    />
                  </div>

                  <div>
                    <label className="block mb-1">티켓 수령 방법</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="phone"
                          checked={deliveryMethod === "phone"}
                          onChange={handleDeliveryMethodChange}
                        />
                        <span className="ml-2">모바일 티켓</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="site"
                          checked={deliveryMethod === "site"}
                          onChange={handleDeliveryMethodChange}
                        />
                        <span className="ml-2">현장 수령</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="mail"
                          checked={deliveryMethod === "mail"}
                          onChange={handleDeliveryMethodChange}
                        />
                        <span className="ml-2">우편 발송</span>
                      </label>
                    </div>
                  </div>
                  {deliveryMethod === "mail" && (
                    <div>
                      <label className="block mb-1">
                        배송지 주소 <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-stretch">
                        {" "}
                        {/* items-center에서 items-stretch로 변경 */}
                        <input
                          type="text"
                          value={address}
                          onChange={handleAddressChange}
                          className="w-full p-2 border rounded-l focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400"
                          placeholder="주소 입력"
                        />
                        <button
                          type="button"
                          onClick={handleAddressSearchClick}
                          className="whitespace-nowrap bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-r border-t border-r border-b border-orange-400 focus:outline-none"
                        >
                          주소 찾기
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        우편 발송 시 배송비 3,000원이 추가됩니다.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={privacyAgreed}
                        onChange={handlePrivacyAgreementChange}
                      />
                      <span className="ml-2">
                        개인정보 수집 및 이용에 동의합니다. (필수)
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={handlePrevStep}
                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded"
                  >
                    이전 단계
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="bg-orange-400 text-white px-6 py-2 rounded"
                  >
                    다음 단계로
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">결제 방법 선택</h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    className={`p-4 rounded border ${
                      selectedPaymentMethod === "card"
                        ? "border-orange-400 bg-orange-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => handlePaymentMethodSelect("card")}
                  >
                    <div className="text-center">
                      <div className="text-center mb-2">💳</div>
                      <div>신용카드/소셜페이</div>
                    </div>
                  </button>

                  <button
                    className={`p-4 rounded border ${
                      selectedPaymentMethod === "trans"
                        ? "border-orange-400 bg-orange-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => handlePaymentMethodSelect("trans")}
                  >
                    <div className="text-center">
                      <div className="text-blue-500 text-center mb-2">🏦</div>
                      <div>무통장입금</div>
                    </div>
                  </button>
                </div>

                <div className="bg-gray-50 p-4 rounded mb-6">
                  <div className="flex justify-between mb-2">
                    <span>티켓 금액</span>
                    <span>
                      {formatPrice(unitPrice)} × {ticketQuantity} ={" "}
                      {formatPrice(totalPrice)}
                    </span>
                  </div>

                  {deliveryMethod === "mail" && (
                    <div className="flex justify-between mb-2">
                      <span>배송비</span>
                      <span>{formatPrice(3000)}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-bold text-orange-500 mt-2 pt-2 border-t border-gray-300">
                    <span>최종 결제 금액</span>
                    <span>
                      {formatPrice(
                        deliveryMethod === "mail"
                          ? totalPrice + 3000
                          : totalPrice
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={handlePrevStep}
                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded"
                  >
                    이전 단계
                  </button>
                  <button
                    onClick={handlePayment}
                    className="bg-orange-400 text-white px-6 py-2 rounded"
                    disabled={!selectedPaymentMethod}
                  >
                    결제하기
                  </button>
                </div>
              </div>
            )}

            {/* 예매 정보 (환불 정책 및 회사 정보) */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">예매 안내</h3>

              <div className="space-y-4 text-sm text-gray-600">
                <div>
                  <h4 className="font-medium text-gray-800">예매/취소 안내</h4>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>예매한 티켓의 취소는 공연 3일 전까지 가능합니다.</li>
                    <li>
                      공연 당일 및 관람일 3일 이내 취소 시, 티켓 금액의 30%가
                      위약금으로 부과됩니다.
                    </li>
                    <li>
                      티켓 분실 및 훼손 시 재발행이 불가하오니 보관에 유의하시기
                      바랍니다.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800">티켓 수령 안내</h4>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>
                      모바일 티켓: 예매 완료 후 문자메시지로 티켓 링크가
                      발송됩니다.
                    </li>
                    <li>
                      현장 수령: 공연 당일 매표소에서 예매자 본인 확인 후 수령
                      가능합니다.
                    </li>
                    <li>
                      우편 발송: 예매 완료일로부터 5일 이내 발송되며, 공연 3일
                      전까지 신청 가능합니다.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800">판매자 정보</h4>
                  <p className="mt-2">상호명: (주)ACM 엔터테인먼트</p>
                  <p>대표이사: 홍길동</p>
                  <p>주소: 서울특별시 강남구 테헤란로 123 ACM빌딩</p>
                  <p>사업자등록번호: 123-45-67890</p>
                  <p>통신판매업신고: 제2023-서울강남-1234호</p>
                  <p>
                    고객센터: 02-123-4567 (평일 10:00-18:00, 점심시간
                    12:30-13:30)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 주소 검색 모달 */}
      {isAddressModalOpen && (
        <AddressSearch
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
          onAddressSelect={handleAddressSelect}
        />
      )}
    </div>
  );
};

export default BookingPaymentComponent;
