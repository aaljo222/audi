import React, { useState, useEffect } from "react";

const CapsuleGame = ({ onWin, remainingPlays }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [capsules, setCapsules] = useState([]);
  const [selectedCapsule, setSelectedCapsule] = useState(null);
  const [result, setResult] = useState(null);

  // 포인트 배열
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

  // 캡슐 초기화
  useEffect(() => {
    initCapsules();
  }, []);

  const initCapsules = () => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#FFD166",
      "#06D6A0",
      "#118AB2",
      "#073B4C",
      "#9B5DE5",
      "#F15BB5",
    ];
    const newCapsules = Array(8)
      .fill()
      .map((_, index) => ({
        id: index + 1,
        color: colors[index % colors.length],
        top: Math.random() * 50 + 10,
        left: (index % 4) * 23 + 5 + Math.random() * 5,
        rotate: Math.random() * 30 - 15,
        scale: 0.9 + Math.random() * 0.2,
      }));
    setCapsules(newCapsules);
  };

  const playCapsuleGame = (capsuleId) => {
    if (isAnimating || remainingPlays <= 0) return;

    setIsAnimating(true);
    setSelectedCapsule(capsuleId);
    setResult(null);

    // 확률에 기반한 결과 선택
    const randomValue = Math.random() * 100;
    let cumulativeWeight = 0;
    let selectedPrize = prizes[0];

    for (const prize of prizes) {
      cumulativeWeight += prize.weight;
      if (randomValue <= cumulativeWeight) {
        selectedPrize = prize;
        break;
      }
    }

    // 애니메이션 및 결과 처리
    setTimeout(() => {
      setIsAnimating(false);
      setResult(selectedPrize);
      onWin(selectedPrize.value);

      // 잠시 후 캡슐 리셋
      setTimeout(() => {
        setSelectedCapsule(null);
        initCapsules();
      }, 3000);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-4">포인트 캡슐머신</h2>
      <p className="mb-6">오늘 남은 기회: {remainingPlays}회</p>

      <div className="relative w-full max-w-md h-[400px] bg-gray-100 rounded-lg overflow-hidden mb-6">
        {/* 캡슐 머신 디자인 */}
        <div className="absolute top-0 left-0 w-full h-[150px] bg-red-500 rounded-t-lg"></div>
        <div className="absolute top-[150px] left-1/2 transform -translate-x-1/2 w-[100px] h-[50px] bg-gray-300 border-4 border-gray-400 rounded-lg"></div>

        {/* 캡슐들 */}
        <div className="absolute top-[200px] left-0 w-full h-[200px] bg-transparent">
          {capsules.map((capsule) => (
            <div
              key={capsule.id}
              className={`absolute cursor-pointer transition-all duration-500 ${
                isAnimating && selectedCapsule === capsule.id
                  ? "animate-bounce-out"
                  : ""
              }`}
              style={{
                top: `${capsule.top}%`,
                left: `${capsule.left}%`,
                transform: `rotate(${capsule.rotate}deg) scale(${capsule.scale})`,
                pointerEvents: isAnimating ? "none" : "auto",
              }}
              onClick={() => playCapsuleGame(capsule.id)}
            >
              <div className="relative w-16 h-16">
                <div
                  className="absolute top-0 left-0 w-full h-1/2 rounded-t-full"
                  style={{ backgroundColor: capsule.color }}
                ></div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 rounded-b-full bg-white"></div>
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 결과 표시 */}
      {remainingPlays <= 0 && (
        <div className="text-xl font-semibold text-red-500 mb-4">
          오늘 이용 가능한 기회를 모두 사용했습니다.
        </div>
      )}

      {!isAnimating && result && (
        <div className="mt-4 text-lg">
          {result.value > 0
            ? `축하합니다! ${result.label}를 획득했습니다!`
            : "아쉽게도 꽝이 나왔습니다. 다음 기회에 도전해보세요!"}
        </div>
      )}

      <p className="text-center text-gray-600 mt-4">
        캡슐을 클릭하여 포인트를 획득하세요!
      </p>
    </div>
  );
};

export default CapsuleGame;
