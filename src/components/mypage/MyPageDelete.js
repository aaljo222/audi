import React, { useState } from "react";

import { deleteUser } from "../../api/memberApi";
import { useNavigate } from "react-router-dom";

const MyPageDelete = ({ userId }) => {
  console.log("userId:", userId);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  // 회원 탈퇴 처리
  const handleDeleteAccount = async () => {
    if (!password) {
      alert("비밀번호를 입력해주세요.");
      setShowModal(false);
      return;
    }

    deleteUser(userId, password)
      .then((i) => {
        alert(i);
        if (i === "회원탈퇴가 완료되었습니다.") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("user");
          navigate("/");
        }
        setShowModal(false);
      })
      .catch((error) => {
        alert("회원탈퇴 중 오류가 발생했습니다.");

        setShowModal(false);
      });
  };

  // 모달 열기
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // 탈퇴 사유 업데이트
  const handleCheckboxChange = (reason) => {
    setSelectedReasons((prev) => {
      const updatedReasons = prev.includes(reason)
        ? prev.filter((item) => item !== reason)
        : prev.length < 2
        ? [...prev, reason]
        : prev; // 최대 두 개까지 선택 가능
      return updatedReasons; // 새로운 배열을 반환
    });
  };

  return (
    // <div className="flex justify-end ml-20 min-h-[92vh] ">
    <div className="flex justify-end ml-[1rem] mt-[0.5rem] min-h-[92vh] select-none">
      <div className="bg-white p-8 rounded-lg shadow-lg mt-20 w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-4">
          회원 탈퇴
        </h2>
        <div className="w-4/5 pl-32 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            회원 탈퇴 유의사항
          </h2>
          <ul className="pl-1 text-sm text-gray-600 mb-3">
            <li className="mb-2">
              <strong className="font-semibold text-red-500">
                계정 비활성화 및 재가입 제한:
              </strong>{" "}
              <p>
                탈퇴 후 계정은 비활성화되며, 동일한 아이디로 재가입할 수
                없습니다.{" "}
              </p>
              <p>로그인 시 "탈퇴된 계정입니다"라는 안내 메시지가 표시됩니다.</p>
            </li>
            <li className="mb-2">
              <strong className="font-semibold text-red-500">
                공연 예매권 및 구매 내역 삭제:
              </strong>{" "}
              <p>
                보유 중이던 공연 예매권 및 구매 내역은 모두 삭제되며, 복구할 수
                없습니다.
              </p>
              <p>환불이 불가능할 수 있으므로 신중히 결정해 주세요.</p>
            </li>
            <li className="mb-2">
              <strong className="font-semibold text-red-500">
                포인트 및 쿠폰 소멸:
              </strong>{" "}
              <p>
                보유 중이던 포인트 및 쿠폰은 모두 삭제되며, 재적립되지 않습니다.
              </p>
            </li>
            <li className="mb-2">
              <strong className="font-semibold text-red-500">
                고객 지원 이용 제한:
              </strong>{" "}
              <p>
                탈퇴 이후에는 구매 내역 확인 및 고객 지원을 통한 문의 처리가
                어렵습니다.
              </p>
            </li>
          </ul>
        </div>
        <p className="text-xl text-gray-800 mb-2 pl-32 text-left">
          계정을 삭제하시려는 이유를 말씀해주세요.사이트 개선에 중요 자료로
          활용됩니다
          <p className="text-base font-light text-gray-800 mb-2 ">
            (선택 이후 회원 탈퇴가 가능합니다. 최대 두 개까지 선택할 수
            있습니다.)
          </p>
        </p>

        <div>
          {[
            "기록 삭제 목적",
            "찾는 제품이 없어서",
            "상품의 가격과 품질이 불만족스러워서",
            "사용 빈도가 낮아서",
            "기타",
          ].map((reason, index) => (
            <label key={index} className="flex items-left cursor-pointer pl-32">
              <input
                type="checkbox"
                className="hidden peer"
                onChange={() => handleCheckboxChange(reason)}
                checked={selectedReasons.includes(reason)}
              />
              <div
                className="w-5 h-5 ml-1 border-2  border-blue-500 rounded-full flex items-center justify-center 
                transition-all peer-checked:bg-blue-500 peer-checked:border-blue-500 peer-checked:after:content-['✔'] peer-checked:after:text-white peer-checked:after:text-sm"
              ></div>
              <span className="ml-2 text-gray-700">{reason}</span>
            </label>
          ))}
        </div>

        <div className="pl-32 w-full">
          <p className="text-xl text-gray-800 mb-2 mt-8 text-left">
            현재 사용 중인 비밀번호
          </p>
          <input
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-3/5 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
          />
        </div>
        <div className="pl-32 w-full">
          <button
            className={`w-3/5 py-2 mt-4 rounded ${
              selectedReasons.length > 0
                ? "bg-red-500 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleOpenModal}
            disabled={selectedReasons.length === 0}
          >
            회원탈퇴
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                정말 탈퇴하시겠어요?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                탈퇴 버튼 선택 시, 계정은 삭제되며 <p>복구되지 않습니다.</p>
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                >
                  탈퇴하기
                </button>
                <button
                  onClick={handleCloseModal}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPageDelete;
