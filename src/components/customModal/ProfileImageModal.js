import React from "react";
import { Camera, Trash2, X } from "lucide-react";

const ProfileImageModal = ({ isOpen, onClose, onEdit, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-80 overflow-hidden transform transition-all">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-center text-gray-800">
            프로필 이미지
          </h3>
        </div>

        <div className="p-2">
          <button
            className="w-full py-3 px-4 flex items-center justify-center gap-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
            onClick={onEdit}
          >
            <Camera size={20} />
            <span className="font-medium">이미지 수정</span>
          </button>

          <button
            className="w-full py-3 px-4 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-1"
            onClick={onDelete}
          >
            <Trash2 size={20} />
            <span className="font-medium">이미지 삭제</span>
          </button>

          <div className="px-4 pt-2 pb-4">
            <button
              className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium mt-1"
              onClick={onClose}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageModal;
