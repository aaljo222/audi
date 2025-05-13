import React from "react";
import { Coins } from "lucide-react";

// 포인트 모달 컴포넌트 - 별도 파일로 분리
const PointModal = ({
  isOpen,
  onClose,
  userPoint,
  pointInput,
  onPointInputChange,
  onApplyPoint,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Coins className="mr-2 text-yellow-500" /> 포인트 사용
        </h3>

        <div className="mb-4 p-3 bg-gray-100 rounded-lg">
          <p className="font-semibold">
            현재 사용 가능한 포인트:{" "}
            <span className="text-orange-500">
              {userPoint.toLocaleString()}P
            </span>
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            사용할 포인트 (1,000P 이상, 100P 단위)
          </label>
          <input
            type="text"
            value={pointInput}
            onChange={onPointInputChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            placeholder="사용할 포인트 입력"
          />
        </div>

        <div className="text-sm text-gray-600 mb-4">
          <ul className="list-disc pl-5 space-y-1">
            <li>1,000P 이상부터 사용 가능합니다.</li>
            <li>100P 단위로 사용 가능합니다.</li>
          </ul>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            취소
          </button>
          <button
            onClick={onApplyPoint}
            className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition"
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointModal;
