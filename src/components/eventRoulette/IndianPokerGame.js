import React, { useState, useEffect } from 'react';
import BettingPanel from './BettingPanel';

const IndianPokerGame = ({ onWin, currentPoints }) => {
  const [gameState, setGameState] = useState('betting'); // betting, playing, result
  const [deck, setDeck] = useState([]);
  const [playerCard, setPlayerCard] = useState(null);
  const [computerCard, setComputerCard] = useState(null);
  const [betAmount, setBetAmount] = useState(10);
  const [gameResult, setGameResult] = useState(null);
  const [winnings, setWinnings] = useState(0);
  
  // 카드 덱 초기화
  useEffect(() => {
    initializeDeck();
  }, []);
  
  const initializeDeck = () => {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const newDeck = [];
    
    for (const suit of suits) {
      for (const value of values) {
        const card = {
          suit,
          value,
          numeric: getNumericValue(value),
          image: `/images/cards/${value}_of_${suit}.png` // 가상의 카드 이미지 경로
        };
        newDeck.push(card);
      }
    }
    
    // 덱 섞기
    const shuffled = [...newDeck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
  };
  
  const getNumericValue = (value) => {
    if (value === 'A') return 14;
    if (value === 'K') return 13;
    if (value === 'Q') return 12;
    if (value === 'J') return 11;
    return parseInt(value);
  };
  
  const handleBet = (amount) => {
    if (amount > currentPoints) {
      alert('베팅 금액이 보유 포인트보다 많습니다.');
      return;
    }
    
    setBetAmount(amount);
    startGame();
  };
  
  const startGame = () => {
    if (deck.length < 2) {
      initializeDeck();
      return;
    }
    
    // 카드 뽑기
    const tempDeck = [...deck];
    const card1 = tempDeck.pop();
    const card2 = tempDeck.pop();
    
    setPlayerCard(card1);
    setComputerCard(card2);
    setDeck(tempDeck);
    setGameState('playing');
  };
  
  const handleHigherChoice = () => {
    if (!playerCard || !computerCard) return;
    
    const playerValue = playerCard.numeric;
    const computerValue = computerCard.numeric;
    
    if (playerValue < computerValue) {
      // 플레이어 승리
      const won = betAmount * 2;
      setWinnings(won);
      setGameResult('win');
      onWin(won);
    } else {
      // 플레이어 패배
      setWinnings(-betAmount);
      setGameResult('lose');
      onWin(-betAmount);
    }
    
    setGameState('result');
  };
  
  const handleLowerChoice = () => {
    if (!playerCard || !computerCard) return;
    
    const playerValue = playerCard.numeric;
    const computerValue = computerCard.numeric;
    
    if (playerValue > computerValue) {
      // 플레이어 승리
      const won = betAmount * 2;
      setWinnings(won);
      setGameResult('win');
      onWin(won);
    } else {
      // 플레이어 패배
      setWinnings(-betAmount);
      setGameResult('lose');
      onWin(-betAmount);
    }
    
    setGameState('result');
  };
  
  const resetGame = () => {
    setPlayerCard(null);
    setComputerCard(null);
    setGameResult(null);
    setWinnings(0);
    setGameState('betting');
    
    if (deck.length < 10) {
      initializeDeck();
    }
  };
  
  const getCardDisplayValue = (card) => {
    if (!card) return '';
    return card.value === '10' ? '10' : card.value.charAt(0);
  };
  
  const getSuitSymbol = (suit) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };
  
  const getCardColor = (suit) => {
    return suit === 'hearts' || suit === 'diamonds' ? 'text-red-600' : 'text-black';
  };
  
  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-4">인디언 포커</h2>
      <p className="mb-6">현재 포인트: {currentPoints.toLocaleString()}P</p>
      
      {gameState === 'betting' && (
        <BettingPanel 
          currentPoints={currentPoints}
          onBet={handleBet}
        />
      )}
      
      {gameState === 'playing' && (
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-96 mb-8">
            {playerCard && (
              <div className="absolute top-0 left-0 w-44 h-64 bg-white rounded-lg shadow-lg border-2 border-gray-300 flex flex-col justify-between p-2">
                <div className={`text-2xl font-bold ${getCardColor(playerCard.suit)}`}>
                  {getCardDisplayValue(playerCard)}
                </div>
                <div className={`text-4xl font-bold self-center ${getCardColor(playerCard.suit)}`}>
                  {getSuitSymbol(playerCard.suit)}
                </div>
                <div className={`text-2xl font-bold self-end rotate-180 ${getCardColor(playerCard.suit)}`}>
                  {getCardDisplayValue(playerCard)}
                </div>
              </div>
            )}
            {computerCard && (
              <div className="absolute top-8 left-20 w-44 h-64 bg-white rounded-lg shadow-lg border-2 border-gray-300 flex items-center justify-center">
                <div className="w-full h-full bg-blue-600 rounded p-2 flex items-center justify-center">
                  <div className="text-white text-2xl font-bold">?</div>
                </div>
              </div>
            )}
          </div>
          
          <p className="text-lg mb-4">
            내 카드는 {getCardDisplayValue(playerCard)}{getSuitSymbol(playerCard.suit)}입니다. 상대방의 카드가 내 카드보다 높을까요, 낮을까요?
          </p>
          
          <div className="flex space-x-4">
            <button
              className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600"
              onClick={handleHigherChoice}
            >
              더 높다
            </button>
            <button
              className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
              onClick={handleLowerChoice}
            >
              더 낮다
            </button>
          </div>
        </div>
      )}
      
      {gameState === 'result' && (
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-96 mb-8">
            {playerCard && (
              <div className="absolute top-0 left-0 w-44 h-64 bg-white rounded-lg shadow-lg border-2 border-gray-300 flex flex-col justify-between p-2">
                <div className={`text-2xl font-bold ${getCardColor(playerCard.suit)}`}>
                  {getCardDisplayValue(playerCard)}
                </div>
                <div className={`text-4xl font-bold self-center ${getCardColor(playerCard.suit)}`}>
                  {getSuitSymbol(playerCard.suit)}
                </div>
                <div className={`text-2xl font-bold self-end rotate-180 ${getCardColor(playerCard.suit)}`}>
                  {getCardDisplayValue(playerCard)}
                </div>
              </div>
            )}
            {computerCard && (
              <div className="absolute top-8 left-20 w-44 h-64 bg-white rounded-lg shadow-lg border-2 border-gray-300 flex flex-col justify-between p-2">
                <div className={`text-2xl font-bold ${getCardColor(computerCard.suit)}`}>
                  {getCardDisplayValue(computerCard)}
                </div>
                <div className={`text-4xl font-bold self-center ${getCardColor(computerCard.suit)}`}>
                  {getSuitSymbol(computerCard.suit)}
                </div>
                <div className={`text-2xl font-bold self-end rotate-180 ${getCardColor(computerCard.suit)}`}>
                  {getCardDisplayValue(computerCard)}
                </div>
              </div>
            )}
          </div>
          
          <div className="text-center mb-6">
            <h3 className={`text-2xl font-bold ${gameResult === 'win' ? 'text-green-600' : 'text-red-600'}`}>
              {gameResult === 'win' ? '승리!' : '패배!'}
            </h3>
            <p className="text-lg mt-2">
              {gameResult === 'win' 
                ? `축하합니다! ${winnings.toLocaleString()}P를 획득했습니다.`
                : `아쉽게도 ${Math.abs(winnings).toLocaleString()}P를 잃었습니다.`}
            </p>
          </div>
          
          <button
            className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
            onClick={resetGame}
          >
            다시 도전하기
          </button>
        </div>
      )}
    </div>
  );
};

export default IndianPokerGame;