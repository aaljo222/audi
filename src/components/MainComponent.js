import React, { useState, useEffect, useMemo } from "react";
import MainMenubar from "./menu/MainMenubar";
import { useNavigate } from "react-router-dom";

// 두 가지 스타일의 배경 및 설정
const backgroundStyles = [
  {
    id: "style1",
    imgUrl: "/images/main3.jpg",
    hasFilter: true,
    hasDarkOverlay: true,
  },
  {
    id: "style2",
    imgUrl: "/images/main2.jpg",
    hasFilter: false,
    hasDarkOverlay: false,
  },
];

const sections = [{ id: "firstPage", text: "첫번째" }];

const MainComponent = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);
  const [activeStyle, setActiveStyle] = useState(0);
  const [nextStyle, setNextStyle] = useState(1);
  const [transition, setTransition] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);

  // 이미지 프리로딩을 위한 상태
  const [imagesLoaded, setImagesLoaded] = useState({});

  // 사운드 웨이브 애니메이션을 위한 랜덤값 (리렌더링 방지)
  const waveHeights = useMemo(
    () => [...Array(14)].map(() => 8 + Math.random() * 8),
    []
  );

  const waveSpeeds = useMemo(
    () => [...Array(14)].map(() => 0.5 + Math.random() * 0.5),
    []
  );

  // 이미지 프리로딩
  useEffect(() => {
    backgroundStyles.forEach((style) => {
      const img = new Image();
      img.src = style.imgUrl;
      img.onload = () => {
        setImagesLoaded((prev) => ({
          ...prev,
          [style.id]: true,
        }));
      };
    });
  }, []);

  useEffect(() => {
    // 컴포넌트 마운트 후 애니메이션 시작
    setTimeout(() => {
      setFadeIn(true);
    }, 300);

    // 5초마다 스타일 전환
    const styleInterval = setInterval(() => {
      startTransition();
    }, 7500);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearInterval(styleInterval);
  }, []);

  // 부드러운 전환을 위한 효과
  useEffect(() => {
    let animationFrame;
    let startTime;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const duration = 1500; // 전환 시간 (ms)

      const progress = Math.min(elapsed / duration, 1);
      setTransitionProgress(progress);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        // 전환 완료
        setActiveStyle(nextStyle);
        setNextStyle((nextStyle + 1) % backgroundStyles.length);
        setTransition(false);
        setTransitionProgress(0);
      }
    };

    if (transition) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [transition, nextStyle]);

  const startTransition = () => {
    setTransition(true);
  };

  const showSection = (index) => {
    if (index >= 0 && index < sections.length) {
      setCurrentIndex(index);
    }
  };

  const handleScroll = (event) => {
    if (event.deltaY > 0) {
      showSection(currentIndex + 1);
    } else {
      showSection(currentIndex - 1);
    }
  };

  // 현재 스타일과 다음 스타일
  const currentStyle = backgroundStyles[activeStyle];
  const upcomingStyle = backgroundStyles[nextStyle];

  // 배경에 적용할 필터 계산
  const getBackgroundFilter = (style, progress = 0) => {
    return style.hasFilter
      ? `grayscale(90%) brightness(0.8)` // 밝기 조정 추가
      : `brightness(1)`; // 필터 없는 경우도 밝기 설정
  };

  // 오버레이 투명도 계산 - 더 부드러운 전환
  const getOverlayOpacity = (style, progress) => {
    return style.hasDarkOverlay ? 0.6 : 0.3;
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      onWheel={handleScroll}
    >
      <MainMenubar currentIndex={currentIndex} />

      {/* 페이지 섹션 */}
      <div className="relative w-full h-full">
        {/* 현재 활성화된 배경 */}
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `url(${currentStyle.imgUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: getBackgroundFilter(currentStyle),
            opacity: transition ? 1 - transitionProgress : 1,
            transition: "opacity 500ms ease-in-out, filter 500ms ease-in-out", // 더 부드러운 전환
            zIndex: 1,
          }}
        />

        {/* 다음 배경 (전환 중일 때만 표시) */}
        {transition && (
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `url(${upcomingStyle.imgUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: getBackgroundFilter(upcomingStyle),
              opacity: transitionProgress,
              transition: "opacity 500ms ease-in-out, filter 500ms ease-in-out", // 더 부드러운 전환
              zIndex: 2,
            }}
          />
        )}

        {sections.map((section, index) => (
          <div
            key={section.id}
            className="absolute top-0 left-0 w-full h-screen flex items-center justify-center text-3xl font-bold transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateY(${(index - currentIndex) * 100}%)`,
              zIndex: 3,
            }}
          >
            {index === 0 ? (
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-1000 ease-in-out ${
                  fadeIn ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  background: transition
                    ? `rgba(0, 0, 0, ${
                        getOverlayOpacity(
                          currentStyle,
                          1 - transitionProgress
                        ) *
                          (1 - transitionProgress) +
                        getOverlayOpacity(upcomingStyle, transitionProgress) *
                          transitionProgress
                      })`
                    : currentStyle.hasDarkOverlay
                    ? "rgba(0, 0, 0, 0.6)"
                    : "rgba(0, 0, 0, 0.3)",
                  backdropFilter: "blur(1px)", // 살짝 블러 효과 추가
                  zIndex: 10,
                }}
              >
                <div className="relative flex flex-col items-center py-8">
                  {/* 메인 텍스트 */}
                  <h1
                    className="text-6xl font-extrabold tracking-wider relative z-10"
                    style={{
                      color: "#FF9E40",
                      textShadow: "0 2px 10px rgba(0, 0, 0, 0.6)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    AudiMew
                  </h1>

                  {/* 오디오 웨이브 효과 - 수정된 부분 */}
                  <div className="flex justify-center items-end h-2 z-0 mt-4">
                    {[...Array(14)].map((_, i) => (
                      <div
                        key={i}
                        className="mx-1 rounded-t-full bg-orange-400"
                        style={{
                          width: "4px",
                          height: `${waveHeights[i]}px`,
                          animationName: "soundWave",
                          animationDuration: `${waveSpeeds[i]}s`,
                          animationTimingFunction: "ease-in-out",
                          animationIterationCount: "infinite",
                          animationDirection: "alternate",
                          animationDelay: `${i * 0.05}s`,
                          opacity: 0.8,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <p
                  className="mt-6 text-lg leading-relaxed max-w-2xl"
                  style={{
                    color: "#f8f8f8",
                    textShadow: "1px 1px 6px rgba(0, 0, 0, 0.7)",
                    lineHeight: "1.8",
                    animationName: "fadeInUp",
                    animationDuration: "1.2s",
                    animationTimingFunction: "ease-out",
                  }}
                >
                  <span style={{ color: "#FFB74D", fontWeight: 600 }}>
                    최고의 사운드
                  </span>
                  를 위한 헤드셋, 스피커 프리미엄 오디오 기기를 제공하는 동시에
                  <br />
                  콘서트, 오케스트라, 뮤지컬 등{" "}
                  <span style={{ color: "#FFB74D", fontWeight: 600 }}>
                    다양한 공연 티켓
                  </span>
                  을 예약할 수 있는
                  <br />
                  기존과 다른 새로운 패러다임의 음악 문화 플랫폼입니다.
                </p>

                <p
                  className="mt-3 text-xl font-bold max-w-2xl"
                  style={{
                    color: "#EEEEEE",
                    textShadow: "1px 1px 6px rgba(0, 0, 0, 0.7)",
                    animationName: "fadeInUp",
                    animationDuration: "1.5s",
                    animationTimingFunction: "ease-out",
                  }}
                >
                  듣고, 경험하고, 소유하는 새로운 방식
                  <br />
                  <span
                    style={{
                      color: "#FF9E40",
                      textShadow: "0 0 10px rgba(255, 158, 64, 0.6)",
                      animationName: "glow",
                      animationDuration: "1.5s",
                      animationIterationCount: "infinite",
                      animationDirection: "alternate",
                    }}
                  >
                    AudiMew
                  </span>
                  에서 시작하세요.
                </p>

                {/* 세련된 시작하기 버튼 */}
                <p
                  onClick={() => {
                    navigate("/member/login");
                  }}
                  className="mt-8 px-8 py-3 bg-transparent text-white font-medium rounded-full border-2 border-orange-400 transition duration-300 hover:bg-orange-500 hover:border-orange-500 hover:text-white hover:shadow-lg"
                  style={{
                    backdropFilter: "blur(5px)",
                    boxShadow: "0 0 15px rgba(255, 158, 64, 0.3)",
                    transition: "all 0.3s ease", // 호버 효과 부드럽게
                  }}
                >
                  Start
                </p>
              </div>
            ) : (
              <span className="relative z-10 text-4xl font-bold">
                {section.text}
              </span>
            )}
          </div>
        ))}
      </div>
      {/* 메인 이름 스타일 추가 - 수정된 부분 */}
      <style>{`
        @keyframes soundWave {
          0% {
            height: 4px;
          }
          100% {
            height: 16px;
          }
        }
      `}</style>
      {/* 애니메이션 스타일 - 수정된 부분 */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes glow {
          from {
            text-shadow: 0 0 5px rgba(255, 158, 64, 0.5),
              0 0 10px rgba(255, 158, 64, 0.3);
          }
          to {
            text-shadow: 0 0 10px rgba(255, 158, 64, 0.8),
              0 0 20px rgba(255, 158, 64, 0.5);
          }
        }
      `}</style>
    </div>
  );
};

export default MainComponent;
