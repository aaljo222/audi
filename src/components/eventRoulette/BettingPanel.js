import React, { useState } from "react";

const BettingPanel = ({ currentPoints, onBet }) => {
  const [betAmount, setBetAmount] = useState(10);
  const presetAmounts = [10, 50, 100, 500, 1000, 5000];

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setBetAmount(value);
  };

  const handlePresetClick = (amount) => {
    setBetAmount(amount);
  };

  const handleBet = () => {
    if (betAmount <= 0) {
      alert("베팅 금액은 0보다 커야 합니다.");
      return;
    }

    if (betAmount > currentPoints) {
      alert("베팅 금액이 보유 포인트보다 많습니다.");
      return;
    }

    onBet(betAmount);
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">베팅하기</h3>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">베팅 금액</label>
        <input
          type="number"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={betAmount}
          onChange={handleInputChange}
          min="1"
          max={currentPoints}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {presetAmounts.map((amount) => (
          <button
            key={amount}
            className={`px-4 py-2 rounded-lg ${
              betAmount === amount
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => handlePresetClick(amount)}
            disabled={amount > currentPoints}
          >
            {amount.toLocaleString()}P
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          onClick={() =>
            setBetAmount(Math.max(1, Math.floor(currentPoints * 0.1)))
          }
        >
          10%
        </button>
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          onClick={() =>
            setBetAmount(Math.max(1, Math.floor(currentPoints * 0.5)))
          }
        >
          50%
        </button>
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          onClick={() => setBetAmount(currentPoints)}
        >
          전액
        </button>
      </div>

      <button
        className="w-full mt-6 px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
        onClick={handleBet}
      >
        {betAmount.toLocaleString()}P 베팅하기
      </button>
    </div>
  );
};

export default BettingPanel;
