import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainMenubar from "../../components/menu/MainMenubar";
import EventComponent from "../../components/eventRoulette/EventComponent";
import RouletteGame from "../../components/eventRoulette/RouletteGame";
import CapsuleGame from "../../components/eventRoulette/CapsuleGame";
import IndianPokerGame from "../../components/eventRoulette/IndianPokerGame";
import PointModal from "../../components/eventRoulette/PointModal";
import axios from "axios";

const EventPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [selectedGame, setSelectedGame] = useState("roulette"); // 'roulette', 'capsule', 'indianPoker'
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({ points: 0, message: "" });
  const [remainingPlays, setRemainingPlays] = useState({
    roulette: 5,
    capsule: 5,
  });

  useEffect(() => {
    // 로그인 상태 확인
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      // 세션 또는 토큰을 확인하여 로그인 상태 검증
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요한 서비스입니다.");
        navigate("/login");
        return;
      }

      // 서버에 사용자 정보 요청
      const response = await axios.get("/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setIsLoggedIn(true);
        setUserId(response.data.id);
        setCurrentPoints(response.data.points);

        // 하루 게임 횟수 가져오기
        const playsResponse = await axios.get(`/api/point/remaining-plays`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (playsResponse.data) {
          setRemainingPlays({
            roulette: playsResponse.data.roulette || 0,
            capsule: playsResponse.data.capsule || 0,
          });
        }
      } else {
        alert("로그인이 필요한 서비스입니다.");
        navigate("/login");
      }
    } catch (error) {
      console.error("로그인 상태 확인 실패:", error);
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    }
  };

  const handleGameSelect = (game) => {
    setSelectedGame(game);
  };

  const handleWin = async (points) => {
    try {
      // 서버에 포인트 업데이트 요청
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/point/update",
        {
          userId: userId,
          points: points,
          gameType: selectedGame,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 사용자 포인트 정보 갱신
      const userResponse = await axios.get("/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCurrentPoints(userResponse.data.points);

      // 남은 플레이 횟수 갱신
      if (selectedGame === "roulette" || selectedGame === "capsule") {
        setRemainingPlays((prev) => ({
          ...prev,
          [selectedGame]: prev[selectedGame] - 1,
        }));
      }

      // 당첨 모달 표시
      let message = "";
      if (points === 0) {
        message = "아쉽게도 꽝이 나왔습니다. 다음 기회에 도전해보세요!";
      } else {
        message = `축하합니다! ${points.toLocaleString()}P를 획득하셨습니다!`;
      }

      setModalInfo({ points, message });
      setShowModal(true);
    } catch (error) {
      console.error("포인트 업데이트 실패:", error);
      alert("포인트 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <MainMenubar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          이벤트 포인트 게임
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
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
                onClick={() => handleGameSelect("roulette")}
              >
                룰렛 (남은 횟수: {remainingPlays.roulette})
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${
                  selectedGame === "capsule"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => handleGameSelect("capsule")}
              >
                캡슐머신 (남은 횟수: {remainingPlays.capsule})
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${
                  selectedGame === "indianPoker"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => handleGameSelect("indianPoker")}
              >
                인디언 포커
              </button>
            </div>
          </div>

          <div className="game-container">
            {selectedGame === "roulette" && (
              <RouletteGame
                onWin={handleWin}
                remainingPlays={remainingPlays.roulette}
              />
            )}
            {selectedGame === "capsule" && (
              <CapsuleGame
                onWin={handleWin}
                remainingPlays={remainingPlays.capsule}
              />
            )}
            {selectedGame === "indianPoker" && (
              <IndianPokerGame
                onWin={handleWin}
                currentPoints={currentPoints}
              />
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">이벤트 게임 안내</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">💫 룰렛 게임</h3>
              <p>
                매일 5회 무료로 참여 가능! 룰렛을 돌려 최대 1천만 포인트를
                획득하세요.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">🎮 캡슐머신</h3>
              <p>
                매일 5회 무료로 참여 가능! 랜덤 캡슐에서 포인트를 뽑아보세요.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">🃏 인디언 포커</h3>
              <p>
                보유 포인트로 배팅하여 더 많은 포인트를 획득할 기회!
                도전해보세요.
              </p>
            </div>
          </div>
        </div>
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

export default EventPage;
