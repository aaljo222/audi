// pages/eventRoulette/EventPage.js
import React, { useState } from "react";
import RouletteGame from "../../components/eventRoulette/RouletteGame";
import CapsuleGame from "../../components/eventRoulette/CapsuleGame";
import IndianPokerGame from "../../components/eventRoulette/IndianPokerGame";
import BettingPanel from "../../components/eventRoulette/BettingPanel";
import MainMenubar from "../../components/menu/MainMenubar";

export default function EventPage() {
  const [activeTab, setActiveTab] = useState("roulette");

  return (
    <div className="bg-white min-h-screen">
      <MainMenubar />
      {/* 상단 영상 영역 */}
      <div className="w-full h-[300px] bg-blue-300 flex items-center justify-center text-2xl font-bold">
        동영상 절대 경로로 삽입 예정
      </div>

      {/* 탭 메뉴 */}
      <div className="text-center mt-6 space-x-6 text-lg font-bold">
        <button onClick={() => setActiveTab("point")}>[포인트]</button>
        <button
          onClick={() => setActiveTab("roulette")}
          className="text-orange-500"
        >
          [룰렛]
        </button>
        <button onClick={() => setActiveTab("capsule")}>[캡슐머신]</button>
        <button onClick={() => setActiveTab("indianPoker")}>
          [인디언 포커]
        </button>
      </div>

      {/* 게임 UI */}
      <div className="mt-8 flex justify-center">
        {activeTab === "roulette" && <RouletteGame />}
        {activeTab === "capsule" && <CapsuleGame />}
        {activeTab === "indianPoker" && (
          <div>
            <IndianPokerGame />
            <BettingPanel />
          </div>
        )}
      </div>
    </div>
  );
}
