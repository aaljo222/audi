import React, { useState, useRef, useEffect } from "react";

const RouletteGame = ({ onWin, remainingPlays }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const wheelRef = useRef(null);

  // 포인트 배열 (시계 방향으로 배치)
  const prizes = [
    { value: 0, label: "꽝", color: "#FF6B6B", weight: 40 },
    { value: 10, label: "10P", color: "#4ECDC4", weight: 25 },
    { value: 100, label: "100P", color: "#FFD166", weight: 15 },
    { value: 500, label: "500P", color: "#06D6A0", weight: 10 },
    { value: 1000, label: "1,000P", color: "#118AB2", weight: 6 },
    { value: 5000, label: "5,000P", color: "#073B4C", weight: 3.5 },
    { value: 100000, label: "100,000P", color: "#9B5DE5", weight: 0.4 },
    { value: 10000000, label: "10,000,000P", color: "#F15BB5", weight: 0.1 },
  ];

  const spinWheel = () => {
    if (isSpinning || remainingPlays <= 0) return;

    setIsSpinning(true);
    setResult(null);

    // 확률에 기반한 결과 선택
    const randomValue = Math.random() * 100; // 0-100 사이의 랜덤 값
    let cumulativeWeight = 0;
    let selectedPrize = prizes[0]; // 기본값

    for (const prize of prizes) {
      cumulativeWeight += prize.weight;
      if (randomValue <= cumulativeWeight) {
        selectedPrize = prize;
        break;
      }
    }

    // 선택된 상품에 대한 각도 계산
    const segmentSize = 360 / prizes.length;
    const segmentIndex = prizes.indexOf(selectedPrize);
    const targetAngle = 360 - (segmentIndex * segmentSize + segmentSize / 2);

    // 회전 각도 (2-4회 더 회전 후 결과)
    const spinRotation = 2160 + 360 + targetAngle; // 최소 6바퀴(2160도) + 추가 정렬각도

    // 회전 애니메이션
    setRotation(spinRotation);

    // 애니메이션 종료 후 결과 처리
    setTimeout(() => {
      setIsSpinning(false);
      setResult(selectedPrize);
      onWin(selectedPrize.value);
    }, 5000); // 5초 후 결과 처리
  };

  // 룰렛 세그먼트 렌더링
  const renderSegments = () => {
    const segments = [];
    const segmentSize = 360 / prizes.length;

    prizes.forEach((prize, index) => {
      const startAngle = index * segmentSize;
      const endAngle = (index + 1) * segmentSize;

      // SVG 경로 생성
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = 150 + 140 * Math.cos(startRad);
      const y1 = 150 + 140 * Math.sin(startRad);
      const x2 = 150 + 140 * Math.cos(endRad);
      const y2 = 150 + 140 * Math.sin(endRad);

      const largeArcFlag = segmentSize > 180 ? 1 : 0;

      const path = `M 150 150 L ${x1} ${y1} A 140 140 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      segments.push(
        <path
          key={index}
          d={path}
          fill={prize.color}
          stroke="#fff"
          strokeWidth="1"
        />
      );

      // 텍스트 위치 계산
      const textAngle = (startAngle + endAngle) / 2;
      const textRad = (textAngle * Math.PI) / 180;
      const textX = 150 + 70 * Math.cos(textRad);
      const textY = 150 + 70 * Math.sin(textRad);

      segments.push(
        <text
          key={`text-${index}`}
          x={textX}
          y={textY}
          fill="#fff"
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(${textAngle}, ${textX}, ${textY})`}
        >
          {prize.label}
        </text>
      );
    });

    return segments;
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-4">포인트 룰렛</h2>
      <p className="mb-6">오늘 남은 기회: {remainingPlays}회</p>

      <div className="relative w-[300px] h-[300px] mb-6">
        <svg
          ref={wheelRef}
          className="w-full h-full"
          viewBox="0 0 300 300"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? "transform 5s cubic-bezier(0.2, 0.8, 0.2, 1)"
              : "none",
          }}
        >
          {renderSegments()}
        </svg>

        {/* 화살표 마커 */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <svg width="30" height="30" viewBox="0 0 30 30">
            <polygon points="15,0 0,20 30,20" fill="#333" />
          </svg>
        </div>
      </div>

      <button
        className={`px-6 py-3 rounded-lg text-white font-bold ${
          isSpinning || remainingPlays <= 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
        onClick={spinWheel}
        disabled={isSpinning || remainingPlays <= 0}
      >
        {isSpinning
          ? "룰렛 돌아가는 중..."
          : remainingPlays <= 0
          ? "오늘 기회 모두 소진"
          : "룰렛 돌리기"}
      </button>

      {result && (
        <div className="mt-4 text-lg">
          {result.value > 0
            ? `축하합니다! ${result.label}를 획득했습니다!`
            : "아쉽게도 꽝이 나왔습니다. 다음 기회에 도전해보세요!"}
        </div>
      )}
    </div>
  );
};

export default RouletteGame;
