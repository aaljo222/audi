import React, { useEffect, useState } from "react";
import { cancelTicket } from "../../api/memberApi";

const CancelTicketModal = ({ isOpen, onClose, ticketId, refreshData, uid }) => {
  const [password, setPassword] = useState("");

  // 모달이 닫히면 비밀번호를 초기화
  useEffect(() => {
    if (!isOpen) {
      setPassword("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      const data = {
        ticketId: ticketId,
        userPw: password,
        uid: uid,
      };

      // 예매 취소 요청
      await cancelTicket(data);
      alert("예매 취소가 완료되었습니다!!");
      refreshData();
      onClose();
    } catch (error) {
      alert(error.response.data);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl w-full max-w-xl shadow-xl transform transition-all">
        <h2 className="text-xl font-bold mb-2">티켓 예매 취소 요청</h2>
        <p className="mb-2 text-red-500 font-semibold">
          예매 취소 요청 중에는 취소 또는 변경이 불가능합니다.
        </p>
        <p className="mb-6 text-sm text-gray-500 leading-relaxed">
          취소 요청은 담당자 확인 후 순차적으로 처리되며,
          <br />
          환불은 영업일 기준 3~5일 이내 결제 수단으로 환급됩니다.
        </p>

        <div className="mb-6">
          <input
            type="password"
            className="w-full border border-gray-300 rounded p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={handleSubmit}
          >
            환불 요청
          </button>
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelTicketModal;
