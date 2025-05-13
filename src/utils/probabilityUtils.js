// utils/probabilityUtils.js
export const prizeDistribution = [
  { value: 0, label: "꽝", probability: 40, image: "/images/prize-miss.png" },
  { value: 10, label: "10P", probability: 25, image: "/images/prize-10.png" },
  {
    value: 100,
    label: "100P",
    probability: 15,
    image: "/images/prize-100.png",
  },
  {
    value: 500,
    label: "500P",
    probability: 10,
    image: "/images/prize-500.png",
  },
  {
    value: 1000,
    label: "1,000P",
    probability: 6,
    image: "/images/prize-1000.png",
  },
  {
    value: 5000,
    label: "5,000P",
    probability: 3.5,
    image: "/images/prize-5000.png",
  },
  {
    value: 100000,
    label: "100,000P",
    probability: 0.4,
    image: "/images/prize-100000.png",
  },
  {
    value: 10000000,
    label: "10,000,000P",
    probability: 0.1,
    image: "/images/prize-10000000.png",
  },
];

export const getRandomPrize = () => {
  const random = Math.random() * 100;
  let cumulativeProbability = 0;

  for (const prize of prizeDistribution) {
    cumulativeProbability += prize.probability;
    if (random <= cumulativeProbability) {
      return prize;
    }
  }

  // 기본값 반환 (꽝)
  return prizeDistribution[0];
};

// 하루 사용 횟수 관리
export const getDailyUsageCount = (gameType) => {
  const today = new Date().toDateString();
  const storageKey = `${gameType}_usage_${today}`;
  return parseInt(localStorage.getItem(storageKey) || "0");
};

export const incrementDailyUsageCount = (gameType) => {
  const today = new Date().toDateString();
  const storageKey = `${gameType}_usage_${today}`;
  const currentCount = getDailyUsageCount(gameType);
  localStorage.setItem(storageKey, (currentCount + 1).toString());
  return currentCount + 1;
};

export const canPlayToday = (gameType) => {
  return getDailyUsageCount(gameType) < 5;
};
