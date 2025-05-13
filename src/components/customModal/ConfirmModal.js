import React from "react";

const ConfirmModal = ({ isOpen, onConfirm, onCancel, pname }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-start mt-20 bg-transparent">
      <div className="bg-white p-6 rounded-md shadow-lg">
        <h3 className="text-lg font-semibold mb-4">
          {pname} 삭제하시겠습니까?
        </h3>

        <small className="text-red-400 text-center">
          ⚠️데이터베이스에서 실제로 삭제됩니다⚠️
        </small>
        <div className="flex justify-end space-x-3 mt-2">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={onConfirm}
          >
            삭제
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
            onClick={onCancel}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
