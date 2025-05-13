import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  CheckCircle,
  Truck,
  ShoppingBag,
  Coins,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrder, getUserPoint } from "../../api/userApi";
import MainMenubar from "../menu/MainMenubar";
import PointModal from "../customModal/PointModal";

const PaymentComponent = () => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    phonenumber: "",
    note: "",
  });
  const [cartData, setCartData] = useState([]);
  const [isDirectPurchase, setIsDirectPurchase] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card"); // 기본값: 신용카드/소셜페이
  const [userPoint, setUserPoint] = useState(0); // 사용자 포인트
  const [usingPoint, setUsingPoint] = useState(0); // 사용할 포인트
  const [isPointModalOpen, setIsPointModalOpen] = useState(false); // 포인트 모달 상태
  const [pointInput, setPointInput] = useState(""); // 포인트 입력값
  const [finalPrice, setFinalPrice] = useState(0); // 포인트 적용 후 최종 가격

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const totalPrice = queryParams.get("totalPrice");
  const requestData = JSON.parse(queryParams.get("cartData"));
  const direct = queryParams.get("direct") === "true";
  const loginUser = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    // 데이터 로드 및 초기화
    if (requestData && requestData.length > 0) {
      setCartData(requestData);
      setIsDirectPurchase(direct);

      // 폼 초기화
      setForm({
        name: requestData[0].userDTO.userName || "",
        address: requestData[0].userDTO.userAddress || "",
        phonenumber: requestData[0].userDTO.userPhoneNum || "",
        note: "",
      });

      // 사용자 포인트 조회는 백엔드 API로 구현해야 함
      // TODO: 포인트 조회 API 호출 구현
      // 예: getUserPoint(uid) 함수 호출
      getUserPoint(loginUser.uid).then((data) => {
        setUserPoint(data);
      });

      // 콤마 제거 후 숫자로 변환하여 초기 최종 가격 설정
      setFinalPrice(parseInt(totalPrice.replace(/,/g, "")));
    }
  }, []);

  const [isFormCompleted, setIsFormCompleted] = useState(false); // 기본정보 입력 완료 여부 상태
  const [canProceedToPayment, setCanProceedToPayment] = useState(false); // 결제 진행 가능 여부 상태

  // 폼 입력값 변경 처리 함수
  const handleChange = (e) => {
    const { name, value } = e.target;
    // 새로운 폼 상태를 만들어 업데이트
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    // 모든 필드가 채워졌는지 즉시 확인
    const { name: formName, address, phonenumber, note } = updatedForm;
    const allFieldsFilled = formName && address && phonenumber && note;
    setIsFormCompleted(allFieldsFilled);
  };

  // 기본정보 입력 완료 후 결제 진행 가능 여부 활성화
  const handleFormCompletion = () => {
    // 모든 필드가 채워져 있는지 한 번 더 확인
    const { name, address, phonenumber, note } = form;
    const allFieldsFilled = name && address && phonenumber && note;

    if (allFieldsFilled) {
      setCanProceedToPayment(true);
    } else {
      alert("모든 배송 정보를 입력해주세요.");
    }
  };

  // 포인트 모달 열기
  const openPointModal = () => {
    setIsPointModalOpen(true);
  };

  // 포인트 모달 닫기
  const closePointModal = () => {
    setIsPointModalOpen(false);
    setPointInput("");
  };

  // 포인트 입력값 변경 처리
  const handlePointInputChange = (e) => {
    // 숫자만 입력 가능하도록
    const value = e.target.value.replace(/[^0-9]/g, "");
    setPointInput(value);
  };

  // 포인트 사용 적용
  const applyPoint = () => {
    const pointValue = parseInt(pointInput);

    // 입력값 검증
    if (isNaN(pointValue) || pointValue < 1000) {
      alert("최소 1,000 포인트부터 사용 가능합니다.");
      return;
    }

    // 100 단위 확인
    if (pointValue % 100 !== 0) {
      alert("포인트는 100단위로 사용 가능합니다.");
      return;
    }

    // 보유 포인트보다 많이 사용하려는 경우
    if (pointValue > userPoint) {
      alert("보유한 포인트보다 많은 금액을 사용할 수 없습니다.");
      return;
    }

    const originalPrice = parseInt(totalPrice.replace(/,/g, ""));

    // 상품 가격보다 많은 포인트를 사용하려는 경우
    if (pointValue > originalPrice) {
      alert("결제 금액보다 많은 포인트를 사용할 수 없습니다.");
      return;
    }

    // 포인트 적용 및 최종 가격 계산
    setUsingPoint(pointValue);
    setFinalPrice(originalPrice - pointValue);
    closePointModal();
  };

  // 포인트 사용 취소
  const cancelPoint = () => {
    setUsingPoint(0);
    setFinalPrice(parseInt(totalPrice.replace(/,/g, "")));
  };

  const handlePayment = () => {
    // 결제 데이터 준비
    const send = {
      userdto: {
        uid: cartData[0].userDTO.uid,
      },
      shippingAddress: form.address,
      note: form.note,
      totalPrice: finalPrice, // 포인트 적용된 최종 가격
      usingPoint: usingPoint, // 사용한 포인트
      orderItems: cartData.map((i) => {
        return { pno: i.productDTO.pno, numOfItem: i.numofItem };
      }),
    };

    // 콤마 제거 후 숫자로 변환
    const realprice = finalPrice; // 이미 숫자 타입

    // 상품 개수 계산
    const ProductCount = new Set(cartData.map((item) => item.productDTO.pno))
      .size;

    // 아임포트 결제 모듈 초기화
    const imp = window.IMP;
    imp.init("imp82633673"); // 가맹점 ID

    imp.request_pay(
      {
        pg: "mobilians",
        pay_method: paymentMethod, // 선택한 결제 방식 사용
        name: `${cartData[0].productDTO.pname}${
          ProductCount > 1 ? `외 ${ProductCount - 1}건` : ""
        }`,
        amount: realprice,
      },
      function (rsp) {
        if (rsp.success) {
          // 서버에 주문 정보 저장
          addOrder(rsp.imp_uid, send)
            .then((orderId) => {
              // direct 파라미터를 success 페이지로도 전달하여 바로구매 여부 추적
              alert("결제가 완료되었습니다.");
              navigate(
                `/member/success/${orderId}${
                  isDirectPurchase ? "?direct=true" : ""
                }`
              );
            })
            .catch((err) => {
              const errorMessage =
                err.response?.data ||
                err.message ||
                "알 수 없는 오류가 발생했습니다";
              alert(errorMessage);
              navigate("/");
            });
        } else {
          // 결제 실패 시
          alert("결제에 실패하였습니다. 실패 사유: " + rsp.error_msg);
        }
      }
    );
  };

  return (
    <div>
      <MainMenubar />

      {/* 외부 모달 컴포넌트 사용 */}
      <PointModal
        isOpen={isPointModalOpen}
        onClose={closePointModal}
        userPoint={userPoint}
        pointInput={pointInput}
        onPointInputChange={handlePointInputChange}
        onApplyPoint={applyPoint}
      />

      <div className="h-[89.9vh] mt-24 bg-gray-100 flex flex-col md:flex-row items-start justify-center p-6 gap-8">
        {/* 왼쪽 - 배송 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-2xl rounded-2xl p-8 w-full md:w-2/3  h-auto min-h-[85vh]"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            {isDirectPurchase ? (
              <>
                <ShoppingBag size={24} /> 바로구매 상품
              </>
            ) : (
              <>
                <Truck size={24} /> 장바구니 내역
              </>
            )}
          </h2>
          <div className="mb-10">
            <div className="md:col-span-2 space-y-4">
              {cartData.map((item) => (
                <div
                  key={item.productDTO.pno} // pno를 key로 사용
                  className="flex items-center justify-between bg-white rounded-lg"
                >
                  <img
                    src={
                      item.productDTO.uploadFileNames &&
                      item.productDTO.uploadFileNames.length > 0
                        ? `http://localhost:8089/product/view/s_${item.productDTO.uploadFileNames[0]}`
                        : "/images/defalt.png"
                    }
                    alt={item.productDTO.pname}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1 ml-4">
                    <h2 className="text-lg font-semibold">
                      {item.productDTO.pname}
                    </h2>
                    <p className="text-gray-600">{item.productDTO.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">
                      수량 : {item.numofItem}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Truck size={24} /> 기본 배송 정보
          </h2>

          <div className="space-y-4">
            <div className="pt-4">
              <label className="text-gray-600">이름</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
                placeholder="홍길동"
              />
            </div>

            <div className="pt-4">
              <label className="text-gray-600">전화번호</label>
              <input
                type="text"
                name="phonenumber"
                value={form.phonenumber}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
                placeholder="010-1234-5678"
              />
            </div>

            <div className="pt-4">
              <label className="text-gray-600">주소</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
              />
            </div>

            <div className="pt-4">
              <label className="text-gray-600">요청사항</label>
              <input
                type="text"
                name="note"
                value={form.note}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
                placeholder="문앞에 두고 가주세요"
              />
            </div>

            <div className="pt-12">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleFormCompletion}
                disabled={!isFormCompleted}
                className={`mt-2 h-14 w-full ${
                  isFormCompleted ? "bg-orange-400" : "bg-gray-300"
                } text-white py-3 rounded-lg text-lg font-semibold hover:bg-gray-600 transition `}
              >
                기본정보 입력 완료
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="w-full md:w-1/3 md:overflow-auto">
          <div className="bg-gray-50 p-6 rounded-lg shadow-md md:  top-24">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CreditCard size={24} /> 결제 정보
            </h2>

            {/* 포인트 사용 */}
            <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold flex items-center">
                    <Coins size={20} className="mr-2 text-yellow-500" /> 포인트
                  </p>
                  <p className="text-sm text-gray-500">
                    사용 가능: {userPoint.toLocaleString()}P
                  </p>
                </div>
                <button
                  onClick={openPointModal}
                  disabled={!canProceedToPayment || userPoint < 1000}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    canProceedToPayment && userPoint >= 1000
                      ? "bg-orange-400 text-white hover:bg-orange-500"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  포인트 사용
                </button>
              </div>

              {usingPoint > 0 && (
                <div className="mt-3 p-3 bg-orange-50 rounded-lg flex justify-between items-center">
                  <p className="text-orange-600 font-medium">
                    <span className="font-bold">
                      {usingPoint.toLocaleString()}
                    </span>
                    P 사용
                  </p>
                  <button
                    onClick={cancelPoint}
                    className="text-xs text-gray-500 hover:text-red-500"
                  >
                    취소
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
              <p className="text-lg font-semibold">총 결제 금액</p>
              <div className="flex items-end justify-between mt-2">
                <p className="text-2xl font-bold">
                  {finalPrice.toLocaleString()}원
                </p>
                {usingPoint > 0 && (
                  <p className="text-sm text-gray-500 line-through">
                    {parseInt(totalPrice.replace(/,/g, "")).toLocaleString()}원
                  </p>
                )}
              </div>
            </div>

            {/* 결제 방법 선택 */}
            <div className="mt-4">
              <p className="text-lg font-semibold mb-3">결제 방법 선택</p>

              <div className="grid grid-cols-2 gap-4">
                {/* 신용카드/소셜페이 */}
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all flex flex-col items-center justify-center ${
                    paymentMethod === "card"
                      ? "border-2 border-gray-500 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <div className="text-yellow-500 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-8 h-8"
                    >
                      <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
                      <path
                        fillRule="evenodd"
                        d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-center">신용카드/소셜페이</span>
                </div>

                {/* 무통장입금 */}
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all flex flex-col items-center justify-center ${
                    paymentMethod === "trans"
                      ? "border-2 border-gray-500 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("trans")}
                >
                  <div className="text-green-500 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-8 h-8"
                    >
                      <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a3.833 3.833 0 001.719-.756c.712-.566 1.112-1.35 1.112-2.178 0-.829-.4-1.612-1.113-2.178-.502-.4-1.102-.647-1.719-.756V8.334c.32.115.64.278.921.421l.879.66a.75.75 0 00.9-1.2l-.879-.66a3.423 3.423 0 00-1.821-.75V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-center">무통장입금</span>
                </div>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={!canProceedToPayment}
              onClick={handlePayment}
              className={`mt-6 w-full ${
                canProceedToPayment ? "bg-orange-400" : "bg-gray-300"
              } text-white py-3 rounded-lg text-lg font-semibold hover:bg-gray-600 transition`}
            >
              결제하기
            </motion.button>

            <p className="text-gray-500 text-sm text-center mt-4 flex items-center justify-center gap-1">
              <CheckCircle size={16} className="text-green-500" /> 안전한 결제가
              보장됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;
