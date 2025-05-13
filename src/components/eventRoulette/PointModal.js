import React, { useEffect } from "react";

const PointModal = ({ points, message, onClose }) => {
  useEffect(() => {
    // 모달이 표시될 때 스크롤 방지
    document.body.style.overflow = "hidden";

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // 포인트 값에 따른 스타일 조정
  const getPointStyle = () => {
    if (points === 0) {
      return "text-red-500"; // 꽝
    } else if (points >= 1000000) {
      return "text-purple-600 animate-pulse text-5xl"; // 높은 포인트
    } else if (points >= 1000) {
      return "text-blue-600 text-4xl"; // 중간 포인트
    } else {
      return "text-green-600 text-3xl"; // 낮은 포인트
    }
  };

  // 포인트 값에 따른 배경 조정
  const getBackgroundStyle = () => {
    if (points === 0) {
      return "bg-gray-100"; // 꽝
    } else if (points >= 1000000) {
      return "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"; // 높은 포인트
    } else if (points >= 1000) {
      return "bg-gradient-to-r from-blue-400 to-cyan-300"; // 중간 포인트
    } else {
      return "bg-gradient-to-r from-green-400 to-teal-300"; // 낮은 포인트
    }
  };

  // 포인트 값에 따른 애니메이션 요소
  const renderAnimatedElements = () => {
    if (points === 0) {
      return null; // 꽝일 경우 애니메이션 없음
    }

    // 포인트가 높을수록 더 많은 요소 생성
    const count = points >= 1000000 ? 50 : points >= 1000 ? 30 : 15;
    const elements = [];

    for (let i = 0; i < count; i++) {
      const delay = Math.random() * 2;
      const duration = 1 + Math.random() * 2;
      const size = 10 + Math.random() * 10;
      const left = Math.random() * 100;

      elements.push(
        <div
          key={i}
          className="absolute animate-float bg-white opacity-70 rounded-full"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            bottom: "-20px",
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          }}
        />
      );
    }

    return elements;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div
        className={`relative w-11/12 max-w-md rounded-xl shadow-2xl overflow-hidden ${getBackgroundStyle()}`}
      >
        {/* 애니메이션 요소 */}
        {renderAnimatedElements()}

        <div className="relative z-10 p-6 bg-white bg-opacity-90">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">포인트 획득 결과</h2>

            <div className={`font-bold mb-6 ${getPointStyle()}`}>
              {points === 0 ? "꽝!" : `+${points.toLocaleString()} P`}
            </div>

            <p className="text-gray-700 mb-6">{message}</p>

            <button
              className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
              onClick={onClose}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointModal;
