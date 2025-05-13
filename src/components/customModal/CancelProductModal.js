import React, { useState } from "react";
import { refundProduct } from "../../api/memberApi";

const CancelProductModal = ({
  isOpen,
  onClose,
  pNo,
  orderNo,
  uid,
  refreshData,
}) => {
  if (!isOpen) return null;

  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert("취소 사유를 입력해주세요.");
      return;
    }

    const data = {
      pno: pNo,
      uid: uid,
      realOrderNum: orderNo,
      reason: reason,
    };
    refundProduct(data).then((i) => {
      alert(i);
      console.log(i);
      refreshData();
      onClose();
    });
  };
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl w-full max-w-xl shadow-xl transform transition-all">
        <h2 className="text-xl font-bold mb-2">상품 환불 요청</h2>
        <span className="text-red-500 font-semibold">
          환불 요청이 접수되면 취소 또는 변경이 불가능합니다.
        </span>
        <p className="mb-6 text-sm text-gray-500 leading-relaxed">
          요청이 완료되면 담당자가 확인 후 순차적으로 처리되며,
          <br />
          환불은 영업일 기준 3~5일 이내 결제 수단으로 환급됩니다.
        </p>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            환불 사유 <span className="text-gray-400 text-xs">(필수 사항)</span>
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300 transition-colors"
            rows="3"
            placeholder="예: 배송 지연, 상품 변경, 구매 실수 등"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
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

export default CancelProductModal;
