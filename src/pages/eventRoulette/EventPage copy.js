
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainMenubar from "../../components/menu/MainMenubar";

/**
 * EventPage 컴포넌트 - 포인트 획득 및 배팅 게임 페이지
 * 1. 포인트 획득: 캡슐 머신, 룰렛
 * 2. 포인트 놀이터: 인디언 포커, 홀짝, 블랙잭
 */
const EventPage = () => {
  // 기본 상태 관리
  const [showModal, setShowModal] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("capsule"); // 'capsule', 'roulette', 'playground'
  const [currentIndex, setCurrentIndex] = useState(3);
  const [remainingAttempts, setRemainingAttempts] = useState(1);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [userPoints, setUserPoints] = useState(0); // 사용자 보유 포인트
  
  // 놀이터 관련 상태
  const [activeGame, setActiveGame] = useState("indian"); // 'indian', 'oddeven', 'blackjack'
  const [betAmount, setBetAmount] = useState(100); // 기본 배팅 금액
  const [gameResult, setGameResult] = useState(null); // 게임 결과
  const [gameInProgress, setGameInProgress] = useState(false); // 게임 진행 중 여부
  
  // 게임별 상태
  // 인디언 포커 상태
  const [indianCard, setIndianCard] = useState(null); // 플레이어 카드
  const [dealerCard, setDealerCard] = useState(null); // 딜러 카드
  const [indianChoice, setIndianChoice] = useState(null); // 'higher' 또는 'lower'
  
  // 홀짝 상태
  const [dice, setDice] = useState([1, 1]); // 두 개의 주사위
  const [oddEvenChoice, setOddEvenChoice] = useState(null); // 'odd' 또는 'even'
  
  // 블랙잭 상태
  const [playerCards, setPlayerCards] = useState([]); // 플레이어 카드
  const [dealerCards, setDealerCards] = useState([]); // 딜러 카드
  const [playerScore, setPlayerScore] = useState(0); // 플레이어 점수
  const [dealerScore, setDealerScore] = useState(0); // 딜러 점수
  const [blackjackStage, setBlackjackStage] = useState('bet'); // 'bet', 'player', 'dealer', 'result'
  
  // DOM 요소 참조
  const rouletteRef = useRef(null);
  const capsuleMachineRef = useRef(null);
  const diceRef = useRef(null);
  const navigate = useNavigate();

  /**
   * 컴포넌트 마운트 시 사용자 정보 로드
   */
  useEffect(() => {
    // 사용자의 일일 시도 횟수 및 보유 포인트 확인
    const loadUserInfo = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/member/login", { state: { from: location.pathname } });
          return;
        }

        // 일일 시도 횟수 확인
        const attemptResponse = await fetch("/api/event/check-daily-attempt", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (attemptResponse.ok) {
          const attemptData = await attemptResponse.json();
          setRemainingAttempts(attemptData.remainingAttempts);
          setHasPlayed(attemptData.remainingAttempts === 0);
        }

        // 사용자 포인트 확인
        const pointsResponse = await fetch("/api/user/points", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (pointsResponse.ok) {
          const pointsData = await pointsResponse.json();
          setUserPoints(pointsData.points);
        }
      } catch (error) {
        console.error("Error loading user info:", error);
      }
    };

    loadUserInfo();
  }, []);

  /**
   * 포인트 옵션 정의: 각 포인트 값과 확률 설정
   */
  const pointOptions = [
    { points: 10, probability: 0.4 },
    { points: 50, probability: 0.3 },
    { points: 100, probability: 0.2 },
    { points: 500, probability: 0.08 },
    { points: 1000, probability: 0.02 },
  ];

  // 랜덤 포인트 획득 함수
  const getRandomPoints = () => {
    const rand = Math.random();
    let cumulativeProbability = 0;

    for (const option of pointOptions) {
      cumulativeProbability += option.probability;
      if (rand <= cumulativeProbability) {
        return option.points;
      }
    }

    return pointOptions[0].points;
  };

  // 룰렛 세그먼트 준비 함수
  const prepareSegments = () => {
    const segments = pointOptions.map((option) => ({
      ...option,
      color:
        option.points === 10
          ? "#FF6384"
          : option.points === 50
          ? "#36A2EB"
          : option.points === 100
          ? "#FFCE56"
          : option.points === 500
          ? "#4BC0C0"
          : "#9966FF",
    }));

    const totalWeight = segments.reduce(
      (acc, segment) => acc + segment.probability,
      0
    );
    let currentAngle = 0;

    return segments.map((segment) => {
      const angle = (segment.probability / totalWeight) * 360;
      const startAngle = currentAngle;
      currentAngle += angle;
      const endAngle = currentAngle;

      return {
        ...segment,
        startAngle,
        endAngle,
      };
    });
  };

  const preparedSegments = prepareSegments();

  /**
   * 포인트 획득 처리 및 백엔드 통신 함수
   * @param {number} points - 획득한 포인트
   * @param {boolean} isBet - 배팅 게임인지 여부
   */
  const handlePointsWon = async (points, isBet = false) => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/member/login", { state: { from: location.pathname } });
        return;
      }

      // API 엔드포인트 설정 (일반 획득 vs 배팅)
      const endpoint = isBet ? "/api/event/bet-result" : "/api/event/award-points";

      // 포인트 획득/배팅 결과 전송
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ points, betAmount: isBet ? betAmount : 0 }),
      });

      if (response.ok) {
        const data = await response.json();
        // 사용자 포인트 업데이트
        setUserPoints(data.totalPoints);
        
        // 포인트 획득/배팅 결과 표시
        setEarnedPoints(points);
        setShowModal(true);
        
        if (!isBet) {
          // 일반 이벤트일 경우 시도 횟수 업데이트
          setRemainingAttempts(0);
          setHasPlayed(true);
        }
      } else {
        throw new Error("Failed to process points");
      }
    } catch (error) {
      console.error("Error processing points:", error);
      alert("Sorry, something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      setGameInProgress(false);
    }
  };

  // 사용자 로그인 상태 확인 함수
  const checkUserLogin = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/member/login", { state: { from: location.pathname } });
      return false;
    }
    return true;
  };

  // 배팅 가능 여부 확인
  const canPlaceBet = () => {
    return userPoints >= betAmount && !gameInProgress;
  };

  // 배팅 금액 변경 처리
  const handleBetChange = (amount) => {
    // 최소 배팅액은 50, 최대는 보유 포인트
    const newBet = Math.max(50, Math.min(userPoints, amount));
    setBetAmount(newBet);
  };

  // 룰렛 회전 기능
  const spinWheel = () => {
    if (
      isLoading ||
      rouletteRef.current.classList.contains("spinning") ||
      hasPlayed
    )
      return;
    if (!checkUserLogin()) return;

    rouletteRef.current.classList.add("spinning");

    const minSpins = 5;
    const randomSpin = Math.random() * 360;
    const spinAmount = 360 * minSpins + randomSpin;

    const normalizedPosition = randomSpin % 360;
    let wonPoints = pointOptions[0].points;

    for (const segment of preparedSegments) {
      if (
        normalizedPosition >= segment.startAngle &&
        normalizedPosition < segment.endAngle
      ) {
        wonPoints = segment.points;
        break;
      }
    }

    if (rouletteRef.current) {
      rouletteRef.current.style.transition =
        "transform 5s cubic-bezier(0.1, 0.25, 0.1, 1)";
      rouletteRef.current.style.transform = `rotate(${spinAmount}deg)`;
    }

    setTimeout(() => {
      handlePointsWon(wonPoints);

      setTimeout(() => {
        if (rouletteRef.current) {
          rouletteRef.current.style.transition = "none";
          rouletteRef.current.style.transform = "rotate(0deg)";
          rouletteRef.current.classList.remove("spinning");
        }
      }, 500);
    }, 5000);
  };

  // 캡슐 머신 애니메이션 및 포인트 획득
  const handleMachineClick = () => {
    if (
      isLoading ||
      capsuleMachineRef.current.classList.contains("shaking") ||
      hasPlayed
    )
      return;
    if (!checkUserLogin()) return;

    capsuleMachineRef.current.classList.add("shaking");

    const balls = document.querySelectorAll(".ball");
    balls.forEach((ball) => {
      ball.classList.add("bounce");
    });

    setTimeout(() => {
      const points = getRandomPoints();
      handlePointsWon(points);

      if (capsuleMachineRef.current) {
        capsuleMachineRef.current.classList.remove("shaking");
      }
      balls.forEach((ball) => {
        ball.classList.remove("bounce");
      });
    }, 2000);
  };

  // 캡슐 머신 내부의 공들 생성
  const generateBalls = () => {
    const balls = [];
    const colors = ["red", "blue", "green", "yellow"];

    for (let i = 0; i < 18; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      balls.push(
        <div
          key={i}
          className={`ball ${color}-ball`}
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 50}%`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        />
      );
    }

    return balls;
  };

  // SVG 룰렛 세그먼트 경로 생성
  const generateWheelPath = (segment, index) => {
    const centerX = 150;
    const centerY = 150;
    const radius = 140;

    const startAngle = (segment.startAngle * Math.PI) / 180;
    const endAngle = (segment.endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const largeArcFlag = segment.endAngle - segment.startAngle > 180 ? 1 : 0;
    const path = `M ${centerX},${centerY} L ${x1},${y1} A ${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`;

    return (
      <path
        key={index}
        d={path}
        fill={segment.color}
        stroke="#FFF"
        strokeWidth="1"
      />
    );
  };

  // 룰렛 세그먼트에 텍스트 추가
  const renderSegmentText = (segment, index) => {
    const centerX = 150;
    const centerY = 150;
    const radius = 85;

    const midAngle =
      (((segment.startAngle + segment.endAngle) / 2) * Math.PI) / 180;

    const x = centerX + radius * Math.cos(midAngle);
    const y = centerY + radius * Math.sin(midAngle);

    const textRotation = (midAngle * 180) / Math.PI + 90;

    return (
      <text
        key={`text-${index}`}
        x={x}
        y={y}
        fill="white"
        fontWeight="bold"
        fontSize="14"
        textAnchor="middle"
        alignmentBaseline="middle"
        transform={`rotate(${textRotation}, ${x}, ${y})`}
      >
        {segment.points}
      </text>
    );
  };

  // 모달 닫기
  const closeModal = () => {
    setShowModal(false);
    setGameResult(null);
    
    // 블랙잭 게임 초기화
    if (activeGame === "blackjack" && blackjackStage === "result") {
      setBlackjackStage("bet");
      setPlayerCards([]);
      setDealerCards([]);
      setPlayerScore(0);
      setDealerScore(0);
    }
  };

  /**
   * ================================================
   * 인디언 포커 게임 관련 함수
   * ================================================
   */
  
  // 카드 덱 생성
  const createDeck = () => {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];
    
    for (const suit of suits) {
      for (const value of values) {
        deck.push({ suit, value, numValue: getCardValue(value) });
      }
    }
    
    return deck;
  };
  
  // 카드 숫자 값 반환
  const getCardValue = (value) => {
    if (value === 'A') return 14;
    if (value === 'K') return 13;
    if (value === 'Q') return 12;
    if (value === 'J') return 11;
    return parseInt(value);
  };
  
  // 카드 덱 섞기
  const shuffleDeck = (deck) => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  // 인디언 포커 게임 시작
  const startIndianPoker = () => {
    if (!canPlaceBet()) return;
    
    setGameInProgress(true);
    
    // 카드 덱 생성 및 섞기
    const deck = shuffleDeck(createDeck());
    
    // 플레이어와 딜러에게 카드 한 장씩 배분
    const playerCard = deck[0];
    const dealerCardValue = deck[1];
    
    // 플레이어는 자신의 카드를 볼 수 없음 (인디언 포커 규칙)
    setIndianCard(playerCard);
    setDealerCard(dealerCardValue);
    
    // 사용자가 높은지 낮은지 선택해야 함
    setIndianChoice(null);
    setGameResult(null);
  };
  
  // 인디언 포커 선택 처리 (높거나 낮음)
  const makeIndianChoice = (choice) => {
    if (!gameInProgress || !indianCard || !dealerCard) return;
    
    setIndianChoice(choice);
    
    // 플레이어와 딜러 카드 비교
    const isPlayerHigher = indianCard.numValue > dealerCard.numValue;
    
    // 결과 판정
    let result;
    if ((choice === 'higher' && isPlayerHigher) || (choice === 'lower' && !isPlayerHigher)) {
      // 플레이어 승리
      result = {
        win: true,
        message: `You win! Your card (${indianCard.value} of ${indianCard.suit}) was ${isPlayerHigher ? 'higher' : 'lower'} than dealer's card (${dealerCard.value} of ${dealerCard.suit}).`
      };
      // 배팅 금액의 2배를 획득
      handlePointsWon(betAmount, true);
    } else if (indianCard.numValue === dealerCard.numValue) {
      // 무승부 (동일한 값)
      result = {
        win: null,
        message: `It's a tie! Both cards are ${indianCard.value}.`
      };
      // 배팅 금액 반환
      handlePointsWon(0, true);
    } else {
      // 플레이어 패배
      result = {
        win: false,
        message: `You lose! Your card (${indianCard.value} of ${indianCard.suit}) was ${!isPlayerHigher ? 'higher' : 'lower'} than dealer's card (${dealerCard.value} of ${dealerCard.suit}).`
      };
      // 배팅 금액 잃음
      handlePointsWon(-betAmount, true);
    }
    
    setGameResult(result);
  };

  /**
   * ================================================
   * 홀짝 게임 관련 함수
   * ================================================
   */
  
  // 주사위 굴리기 애니메이션
  const rollDice = () => {
    if (!canPlaceBet()) return;
    
    setGameInProgress(true);
    setGameResult(null);
    
    // 주사위 애니메이션을 위한 랜덤 값
    const animateDice = () => {
      const die1 = Math.floor(Math.random() * 6) + 1;
      const die2 = Math.floor(Math.random() * 6) + 1;
      setDice([die1, die2]);
    };
    
    // 애니메이션 효과 (빠르게 여러 번 주사위 변경)
    let rollCount = 0;
    const maxRolls = 15;
    const rollInterval = setInterval(() => {
      animateDice();
      rollCount++;
      
      if (rollCount >= maxRolls) {
        clearInterval(rollInterval);
        finalizeOddEvenGame();
      }
    }, 100);
  };
  
  // 홀짝 게임 마무리 및 결과 판정
  const finalizeOddEvenGame = () => {
    // 최종 주사위 결과 생성
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    setDice([die1, die2]);
    
    // 주사위 합 계산
    const sum = die1 + die2;
    const isOdd = sum % 2 === 1;
    
    // 결과 판정
    let result;
    if ((oddEvenChoice === 'odd' && isOdd) || (oddEvenChoice === 'even' && !isOdd)) {
      // 플레이어 승리
      result = {
        win: true,
        message: `You win! Dice sum is ${sum}, which is ${isOdd ? 'odd' : 'even'}.`
      };
      // 배팅 금액의 1.8배를 획득 (20% 하우스 엣지)
      handlePointsWon(Math.floor(betAmount * 0.8), true);
    } else {
      // 플레이어 패배
      result = {
        win: false,
        message: `You lose! Dice sum is ${sum}, which is ${isOdd ? 'odd' : 'even'}.`
      };
      // 배팅 금액 잃음
      handlePointsWon(-betAmount, true);
    }
    
    setGameResult(result);
  };
  
  // 홀짝 선택 처리
  const makeOddEvenChoice = (choice) => {
    setOddEvenChoice(choice);
    rollDice();
  };

  /**
   * ================================================
   * 블랙잭 게임 관련 함수
   * ================================================
   */
  
  // 블랙잭 카드 점수 계산
  const calculateBlackjackScore = (cards) => {
    let score = 0;
    let aces = 0;
    
    for (const card of cards) {
      if (card.value === 'A') {
        aces++;
        score += 11;
      } else if (['K', 'Q', 'J'].includes(card.value)) {
        score += 10;
      } else {
        score += parseInt(card.value);
      }
    }
    
    // Ace는 1 또는 11로 계산 가능 (21을 넘지 않도록)
    while (score > 21 && aces > 0) {
      score -= 10; // 11에서 1로 변경 (차이는 10)
      aces--;
    }
    
    return score;
  };
  
  // 블랙잭 게임 시작
  const startBlackjack = () => {
    if (!canPlaceBet()) return;
    
    setGameInProgress(true);
    setGameResult(null);
    setBlackjackStage('player');
    
    // 카드 덱 생성 및 섞기
    const deck = shuffleDeck(createDeck());
    
    // 초기 카드 배분 (플레이어 2장, 딜러 1장 공개)
    const playerInitialCards = [deck[0], deck[2]];
    const dealerInitialCards = [deck[1]];
    
    setPlayerCards(playerInitialCards);
    setDealerCards(dealerInitialCards);
    
    // 점수 계산
    setPlayerScore(calculateBlackjackScore(playerInitialCards));
    setDealerScore(calculateBlackjackScore(dealerInitialCards));
  };
  
  // 블랙잭 플레이어 카드 추가 (히트)
  const blackjackHit = () => {
    if (blackjackStage !== 'player' || playerScore >= 21) return;
    
    // 카드 덱 생성 및 섞기
    const deck = shuffleDeck(createDeck());
    
    // 새 카드 뽑기
    const newCard = deck[0];
    const updatedCards = [...playerCards, newCard];
    setPlayerCards(updatedCards);
    
    // 점수 업데이트
    const newScore = calculateBlackjackScore(updatedCards);
    setPlayerScore(newScore);
    
    // 21 초과 시 자동 패배
    if (newScore > 21) {
      const result = {
        win: false,
        message: "Bust! You went over 21."
      };
      setGameResult(result);
      setBlackjackStage('result');
      handlePointsWon(-betAmount, true);
    }
  };
  
  // 블랙잭 플레이어 카드 추가 중단 (스탠드)
  const blackjackStand = () => {
    if (blackjackStage !== 'player') return;
    
    setBlackjackStage('dealer');
    
    // 딜러의 턴 시작
    blackjackDealerTurn();
  };
  
  // 블랙잭 딜러 턴 처리
  const blackjackDealerTurn = () => {
    // 카드 덱 생성 및 섞기
    const deck = shuffleDeck(createDeck());
    
    // 딜러의 패를 공개하기 위한 두 번째 카드 추가
    let currentDealerCards = [...dealerCards, deck[0]];
    let currentDealerScore = calculateBlackjackScore(currentDealerCards);
    
    // 딜러는 17점 이상이 될 때까지 카드를 계속 뽑음
    let cardIndex = 1;
    while (currentDealerScore < 17) {
      const newCard = deck[cardIndex];
      currentDealerCards.push(newCard);
      currentDealerScore = calculateBlackjackScore(currentDealerCards);
      cardIndex++;
    }
    
    // 딜러 카드와 점수 업데이트
    setDealerCards(currentDealerCards);
    setDealerScore(currentDealerScore);
    
    // 결과 판정
    let result;
    if (currentDealerScore > 21) {
      // 딜러 버스트 (플레이어 승)
      result = {
        win: true,
        message: "Dealer busted! You win!"
      };
      handlePointsWon(betAmount, true);
    } else if (playerScore > currentDealerScore) {
      // 플레이어 점수가 높음 (플레이어 승)
      result = {
        win: true,
        message: `You win with ${playerScore} against dealer's ${currentDealerScore}!`
      };
      handlePointsWon(betAmount, true);
    } else if (playerScore < currentDealerScore) {
      // 딜러 점수가 높음 (플레이어 패)
      result = {
        win: false,
        message: `You lose with ${playerScore} against dealer's ${currentDealerScore}.`
      };
      handlePointsWon(-betAmount, true);
    } else {
      // 동점 (푸시)
      result = {
        win: null,
        message: `Push! Both you and dealer have ${playerScore}.`
      };
      handlePointsWon(0, true);
    }
    
    setGameResult(result);
    setBlackjackStage('result');
  };

  // 카드 렌더링 함수
  const renderCard = (card, index, faceDown = false) => {
    if (faceDown) {
      return (
        <div 
          key={index}
          className="relative w-14 h-20 bg-gray-800 rounded-md shadow-md border-2 border-gray-300 flex items-center justify-center"
        >
          <div className="absolute inset-1 bg-blue-300 rounded opacity-90 flex items-center justify-center">
            <div className="text-blue-800 font-bold text-xl">?</div>
          </div>
        </div>
      );
    }
    
    const color = card.suit === 'hearts' || card.suit === 'diamonds' ? 'text-red-600' : 'text-gray-800';
    
    return (
      <div 
      key={index}
      className="relative w-14 h-20 bg-white rounded-md shadow-md border-2 border-gray-300 p-1"
    >
      <div className={`absolute top-1 left-1 font-bold ${color}`}>{card.value}</div>
      <div className={`absolute bottom-1 right-1 font-bold ${color}`}>{card.value}</div>
      <div className={`absolute inset-0 flex items-center justify-center ${color}`}>
        {card.suit === 'hearts' && '♥️'}
        {card.suit === 'diamonds' && '♦️'}
        {card.suit === 'clubs' && '♣️'}
        {card.suit === 'spades' && '♠️'}
      </div>
    </div>
  );
};

// 주사위 렌더링
const renderDie = (value) => {
  const spots = [];
  
  switch (value) {
    case 1:
      spots.push(<div key="center" className="absolute inset-0 m-auto w-2 h-2 bg-black rounded-full" />);
      break;
    case 2:
      spots.push(
        <div key="top-right" className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full" />,
        <div key="bottom-left" className="absolute bottom-1 left-1 w-2 h-2 bg-black rounded-full" />
      );
      break;
    case 3:
      spots.push(
        <div key="top-right" className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full" />,
        <div key="center" className="absolute inset-0 m-auto w-2 h-2 bg-black rounded-full" />,
        <div key="bottom-left" className="absolute bottom-1 left-1 w-2 h-2 bg-black rounded-full" />
      );
      break;
    case 4:
      spots.push(
        <div key="top-left" className="absolute top-1 left-1 w-2 h-2 bg-black rounded-full" />,
        <div key="top-right" className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full" />,
        <div key="bottom-left" className="absolute bottom-1 left-1 w-2 h-2 bg-black rounded-full" />,
        <div key="bottom-right" className="absolute bottom-1 right-1 w-2 h-2 bg-black rounded-full" />
      );
      break;
    case 5:
      spots.push(
        <div key="top-left" className="absolute top-1 left-1 w-2 h-2 bg-black rounded-full" />,
        <div key="top-right" className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full" />,
        <div key="center" className="absolute inset-0 m-auto w-2 h-2 bg-black rounded-full" />,
        <div key="bottom-left" className="absolute bottom-1 left-1 w-2 h-2 bg-black rounded-full" />,
        <div key="bottom-right" className="absolute bottom-1 right-1 w-2 h-2 bg-black rounded-full" />
      );
      break;
    case 6:
      spots.push(
        <div key="top-left" className="absolute top-1 left-1 w-2 h-2 bg-black rounded-full" />,
        <div key="mid-left" className="absolute top-1/2 left-1 transform -translate-y-1/2 w-2 h-2 bg-black rounded-full" />,
        <div key="bottom-left" className="absolute bottom-1 left-1 w-2 h-2 bg-black rounded-full" />,
        <div key="top-right" className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full" />,
        <div key="mid-right" className="absolute top-1/2 right-1 transform -translate-y-1/2 w-2 h-2 bg-black rounded-full" />,
        <div key="bottom-right" className="absolute bottom-1 right-1 w-2 h-2 bg-black rounded-full" />
      );
      break;
    default:
      break;
  }
  
  return (
    <div className="relative w-12 h-12 bg-white rounded-md shadow-lg border border-gray-300">
      {spots}
    </div>
  );
};

return (
  <div className="min-h-screen bg-gray-100">
    <MainMenubar />
    
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">포인트 이벤트</h1>
      
      {/* 현재 보유 포인트 표시 */}
      <div className="bg-blue-100 p-4 rounded-lg shadow mb-6">
        <p className="text-center text-xl">
          <span className="font-bold">현재 보유 포인트:</span> {userPoints} P
        </p>
      </div>
      
      {/* 탭 메뉴 */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "capsule"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
          onClick={() => setActiveTab("capsule")}
        >
          캡슐 머신
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "roulette"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
          onClick={() => setActiveTab("roulette")}
        >
          룰렛
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "playground"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
          onClick={() => setActiveTab("playground")}
        >
          포인트 놀이터
        </button>
      </div>
      
      {/* 캡슐 머신 */}
      {activeTab === "capsule" && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">캡슐 머신</h2>
          <p className="mb-6">캡슐을 뽑아 포인트를 획득하세요!</p>
          
          <div
            ref={capsuleMachineRef}
            className="relative w-64 h-80 bg-red-500 rounded-t-full mx-auto mb-6 cursor-pointer"
            onClick={handleMachineClick}
          >
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-transparent rounded-b-lg border-4 border-red-600 overflow-hidden">
              <div className="absolute inset-0 bg-blue-100 opacity-30"></div>
              {generateBalls()}
            </div>
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-yellow-400 rounded-full border-4 border-yellow-500 flex items-center justify-center">
              <div className="w-10 h-10 bg-yellow-300 rounded-full"></div>
            </div>
          </div>
          
          <p className="text-lg">남은 시도 횟수: {remainingAttempts}</p>
          {hasPlayed && (
            <p className="text-red-500 mt-2">오늘의 기회를 모두 사용했습니다. 내일 다시 도전하세요!</p>
          )}
        </div>
      )}
      
      {/* 룰렛 */}
      {activeTab === "roulette" && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">포인트 룰렛</h2>
          <p className="mb-6">룰렛을 돌려 포인트를 획득하세요!</p>
          
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-4 w-0 h-0 border-t-8 border-t-transparent border-r-16 border-r-red-600 border-b-8 border-b-transparent z-10"></div>
              <div className="relative w-80 h-80">
                <svg
                  ref={rouletteRef}
                  width="300"
                  height="300"
                  viewBox="0 0 300 300"
                  className="transform rotate-0 transition-transform cursor-pointer"
                  onClick={spinWheel}
                >
                  {preparedSegments.map((segment, index) => generateWheelPath(segment, index))}
                  {preparedSegments.map((segment, index) => renderSegmentText(segment, index))}
                  <circle cx="150" cy="150" r="15" fill="#fff" stroke="#000" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
          
          <p className="text-lg">남은 시도 횟수: {remainingAttempts}</p>
          {hasPlayed && (
            <p className="text-red-500 mt-2">오늘의 기회를 모두 사용했습니다. 내일 다시 도전하세요!</p>
          )}
        </div>
      )}
      
      {/* 포인트 놀이터 */}
      {activeTab === "playground" && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center">포인트 놀이터</h2>
          <p className="text-center mb-6">포인트를 배팅하고 게임을 즐기세요!</p>
          
          {/* 놀이터 게임 선택 탭 */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`px-4 py-2 font-medium ${
                activeGame === "indian"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-green-500"
              }`}
              onClick={() => setActiveGame("indian")}
            >
              인디언 포커
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeGame === "oddeven"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-green-500"
              }`}
              onClick={() => setActiveGame("oddeven")}
            >
              홀짝 게임
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeGame === "blackjack"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-green-500"
              }`}
              onClick={() => setActiveGame("blackjack")}
            >
              블랙잭
            </button>
          </div>
          
          {/* 배팅 금액 설정 */}
          <div className="bg-gray-100 p-4 rounded-lg shadow mb-6">
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium">배팅 금액:</p>
              <div className="flex items-center">
                <button
                  className="px-3 py-1 bg-gray-300 rounded-l hover:bg-gray-400"
                  onClick={() => handleBetChange(betAmount - 50)}
                >
                  -
                </button>
                <input
                  type="number"
                  className="w-20 text-center border-t border-b border-gray-300 py-1"
                  value={betAmount}
                  onChange={(e) => handleBetChange(Number(e.target.value))}
                  min="50"
                  max={userPoints}
                />
                <button
                  className="px-3 py-1 bg-gray-300 rounded-r hover:bg-gray-400"
                  onClick={() => handleBetChange(betAmount + 50)}
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                onClick={() => handleBetChange(50)}
              >
                50P
              </button>
              <button
                className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                onClick={() => handleBetChange(100)}
              >
                100P
              </button>
              <button
                className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                onClick={() => handleBetChange(500)}
              >
                500P
              </button>
              <button
                className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                onClick={() => handleBetChange(userPoints)}
              >
                MAX
              </button>
            </div>
          </div>
          
          {/* 인디언 포커 */}
          {activeGame === "indian" && (
            <div className="bg-green-50 p-4 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-3">인디언 포커</h3>
              <p className="mb-4">딜러의 카드를 보고 내 카드가 더 높은지 낮은지 맞추세요!</p>
              
              <div className="flex justify-center space-x-16 mb-6">
                {/* 플레이어 카드 */}
                <div className="text-center">
                  <p className="font-bold mb-2">내 카드</p>
                  {indianCard ? (
                    gameResult ? (
                      renderCard(indianCard, 'player')
                    ) : (
                      renderCard({}, 'player', true)
                    )
                  ) : (
                    <div className="w-14 h-20 bg-gray-200 rounded-md"></div>
                  )}
                </div>
                
                {/* 딜러 카드 */}
                <div className="text-center">
                  <p className="font-bold mb-2">딜러 카드</p>
                  {dealerCard ? (
                    renderCard(dealerCard, 'dealer')
                  ) : (
                    <div className="w-14 h-20 bg-gray-200 rounded-md"></div>
                  )}
                </div>
              </div>
              
              {/* 게임 결과 */}
              {gameResult && (
                <div className={`text-center mb-4 p-2 rounded ${
                  gameResult.win === true
                    ? "bg-green-100 text-green-800"
                    : gameResult.win === false
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  <p className="font-bold">{gameResult.message}</p>
                </div>
              )}
              
              {/* 게임 컨트롤 */}
              <div className="flex justify-center space-x-4">
                {!indianCard ? (
                  <button
                    className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ${
                      !canPlaceBet() && "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={startIndianPoker}
                    disabled={!canPlaceBet()}
                  >
                    게임 시작
                  </button>
                ) : (
                  !gameResult && (
                    <>
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => makeIndianChoice('higher')}
                      >
                        더 높다
                      </button>
                      <button
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={() => makeIndianChoice('lower')}
                      >
                        더 낮다
                      </button>
                    </>
                  )
                )}
                
                {gameResult && (
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => {
                      setIndianCard(null);
                      setDealerCard(null);
                      setGameResult(null);
                      setGameInProgress(false);
                    }}
                  >
                    다시 하기
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* 홀짝 게임 */}
          {activeGame === "oddeven" && (
            <div className="bg-purple-50 p-4 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-3">홀짝 게임</h3>
              <p className="mb-4">두 주사위의 합이 홀수인지 짝수인지 맞추세요!</p>
              
              <div className="flex justify-center space-x-6 mb-6">
                {/* 두 개의 주사위 */}
                {renderDie(dice[0])}
                {renderDie(dice[1])}
              </div>
              
              {/* 게임 결과 */}
              {gameResult && (
                <div className={`text-center mb-4 p-2 rounded ${
                  gameResult.win === true
                    ? "bg-green-100 text-green-800"
                    : gameResult.win === false
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  <p className="font-bold">{gameResult.message}</p>
                </div>
              )}
              
              {/* 게임 컨트롤 */}
              <div className="flex justify-center space-x-4">
                {!gameInProgress ? (
                  <>
                    <button
                      className={`px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 ${
                        !canPlaceBet() && "opacity-50 cursor-not-allowed"
                      }`}
                      onClick={() => makeOddEvenChoice('odd')}
                      disabled={!canPlaceBet()}
                    >
                      홀수 (Odd)
                    </button>
                    <button
                      className={`px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 ${
                        !canPlaceBet() && "opacity-50 cursor-not-allowed"
                      }`}
                      onClick={() => makeOddEvenChoice('even')}
                      disabled={!canPlaceBet()}
                    >
                      짝수 (Even)
                    </button>
                  </>
                ) : (
                  gameResult && (
                    <button
                      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                      onClick={() => {
                        setGameResult(null);
                        setGameInProgress(false);
                      }}
                    >
                      다시 하기
                    </button>
                  )
                )}
              </div>
            </div>
          )}
          
          {/* 블랙잭 게임 */}
          {activeGame === "blackjack" && (
            <div className="bg-blue-50 p-4 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-3">블랙잭</h3>
              <p className="mb-4">카드의 합이 21에 가까워지도록 하세요. 21을 초과하면 bust!</p>
              
              {/* 딜러 카드 */}
              <div className="mb-6">
                <p className="font-bold mb-2">딜러 카드 ({dealerScore})</p>
                <div className="flex space-x-2">
                  {dealerCards.map((card, index) => (
                    renderCard(card, `dealer-${index}`)
                  ))}
                  {blackjackStage === 'player' && dealerCards.length === 1 && (
                    <div className="w-14 h-20 bg-gray-200 rounded-md"></div>
                  )}
                </div>
              </div>
              
              {/* 플레이어 카드 */}
              <div className="mb-6">
                <p className="font-bold mb-2">내 카드 ({playerScore})</p>
                <div className="flex space-x-2">
                  {playerCards.map((card, index) => (
                    renderCard(card, `player-${index}`)
                  ))}
                </div>
              </div>
              
              {/* 게임 결과 */}
              {gameResult && (
                <div className={`text-center mb-4 p-2 rounded ${
                  gameResult.win === true
                    ? "bg-green-100 text-green-800"
                    : gameResult.win === false
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  <p className="font-bold">{gameResult.message}</p>
                </div>
              )}
              
              {/* 게임 컨트롤 */}
              <div className="flex justify-center space-x-4">
                {blackjackStage === 'bet' ? (
                  <button
                    className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                      !canPlaceBet() && "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={startBlackjack}
                    disabled={!canPlaceBet()}
                  >
                    게임 시작
                  </button>
                ) : blackjackStage === 'player' ? (
                  <>
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={blackjackHit}
                    >
                      히트 (Hit)
                    </button>
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={blackjackStand}
                    >
                      스탠드 (Stand)
                    </button>
                  </>
                ) : blackjackStage === 'result' && (
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => {
                      setPlayerCards([]);
                      setDealerCards([]);
                      setPlayerScore(0);
                      setDealerScore(0);
                      setBlackjackStage('bet');
                      setGameResult(null);
                      setGameInProgress(false);
                    }}
                  >
                    다시 하기
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    
    {/* 포인트 획득 모달 */}
    {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              {earnedPoints > 0 ? "축하합니다!" : earnedPoints < 0 ? "아쉽네요!" : "무승부!"}
            </h3>
            <p className="text-xl mb-4">
              {earnedPoints > 0
                ? `${earnedPoints} 포인트를 획득했습니다!`
                : earnedPoints < 0
                ? `${Math.abs(earnedPoints)} 포인트를 잃었습니다.`
                : "포인트 변동이 없습니다."}
            </p>
            <p>현재 보유 포인트: {userPoints} P</p>
            <button
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={closeModal}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default EventPage;