import React, { useState, useEffect } from "react";
import RouletteGame from "./RouletteGame";
import CapsuleGame from "./CapsuleGame";
import IndianPokerGame from "./IndianPokerGame";
import PointModal from "./PointModal";

const EventComponent = ({ userId, currentPoints, updatePoints }) => {
  const [selectedGame, setSelectedGame] = useState("roulette");
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({ points: 0, message: "" });
  const [remainingPlays, setRemainingPlays] = useState({
    roulette: 5,
    capsule: 5,
  });

  useEffect(() => {
    // 남은 게임 횟수 가져오기
    if (userId) {
      fetchRemainingPlays();
    }
  }, [userId]);

  const fetchRemainingPlays = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/point/remaining-plays?userId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRemainingPlays({
          roulette: data.roulette || 0,
          capsule: data.capsule || 0,
        });
      }
    } catch (error) {
      console.error("남은 게임 횟수 조회 실패:", error);
    }
  };

  const handleWin = async (points, gameType) => {
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/point/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          points,
          gameType,
        }),
      });

      // 포인트 업데이트
      updatePoints(points);

      // 남은 게임 횟수 갱신
      if (gameType === "roulette" || gameType === "capsule") {
        setRemainingPlays((prev) => ({
          ...prev,
          [gameType]: Math.max(0, prev[gameType] - 1),
        }));
      }

      // 당첨 모달 표시
      let message = "";
      if (points === 0) {
        message = "아쉽게도 꽝이 나왔습니다. 다음 기회에 도전해보세요!";
      } else if (points > 0) {
        message = `축하합니다! ${points.toLocaleString()}P를 획득하셨습니다!`;
      } else {
        message = `아쉽게도 ${Math.abs(
          points
        ).toLocaleString()}P를 잃었습니다.`;
      }

      setModalInfo({ points, message });
      setShowModal(true);
    } catch (error) {
      console.error("포인트 업데이트 실패:", error);
      alert("포인트 업데이트 중 오류가 발생했습니다.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-xl font-semibold">
          내 포인트: {currentPoints.toLocaleString()}P
        </div>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              selectedGame === "roulette"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedGame("roulette")}
          >
            룰렛 (남은 횟수: {remainingPlays.roulette})
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              selectedGame === "capsule"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedGame("capsule")}
          >
            캡슐머신 (남은 횟수: {remainingPlays.capsule})
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              selectedGame === "indianPoker"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedGame("indianPoker")}
          >
            인디언 포커
          </button>
        </div>
      </div>

      <div className="game-container">
        {selectedGame === "roulette" && (
          <RouletteGame
            onWin={(points) => handleWin(points, "roulette")}
            remainingPlays={remainingPlays.roulette}
          />
        )}
        {selectedGame === "capsule" && (
          <CapsuleGame
            onWin={(points) => handleWin(points, "capsule")}
            remainingPlays={remainingPlays.capsule}
          />
        )}
        {selectedGame === "indianPoker" && (
          <IndianPokerGame
            onWin={(points) => handleWin(points, "indianPoker")}
            currentPoints={currentPoints}
          />
        )}
      </div>

      {showModal && (
        <PointModal
          points={modalInfo.points}
          message={modalInfo.message}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default EventComponent;
