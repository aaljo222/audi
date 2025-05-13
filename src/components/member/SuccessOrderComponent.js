import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const LoginComponent = () => {
  const orderNumber = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-10">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full">
        <h1 className="text-3xl font-bold text-[#ad9e87] text-center">
          주문이 완료되었습니다.
        </h1>
        <p className="mt-4 text-lg text-gray-700 text-center">
          주문해주셔서 감사합니다. 주문이 성공적으로 완료되었습니다.
        </p>
        <div className="mt-6 text-center">
          <p className="text-xl font-semibold text-gray-900">주문 번호</p>
          <p className="mt-2 text-2xl text-[#ad9e87]">{orderNumber.order}</p>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            주문 내역 및 배송 정보는 확인은 마이페이지를 확인 해주세요
          </p>
          <button
            className="mt-4 px-6 py-2 bg-[#ad9e87] text-white rounded-lg hover:bg-[#968468] transition duration-300"
            onClick={() =>
              navigate(
                `/member/mypage/${
                  JSON.parse(localStorage.getItem("user")).userId
                }`
              )
            }
          >
            MyPage
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
