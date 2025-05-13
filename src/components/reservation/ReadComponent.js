import React, { useEffect, useRef, useState } from "react";
import MainMenubar from "../menu/MainMenubar";
import { useNavigate, useParams } from "react-router-dom";
import { getConcertByCno } from "../../api/concertApi";
import KakaoMapComponent from "../common/KakaoMapComponent";

const ReadComponent = () => {
  useEffect(() => {
    // 페이지가 로드되면 항상 최상단으로 스크롤
    window.scrollTo(0, 0);
  }, []);
  const mapSectionRef = useRef(null);
  const loginUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const { cno } = useParams();
  const [performance, setPerformance] = useState({
    cno: null,
    cname: "",
    cprice: "",
    cdesc: "",
    cplace: "",
    file: null,
    category: null,
    uploadFileName: "",
    schedulesDtoList: [],
  });

  // 선택된 날짜와 회차 상태 관리
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // 현재 달력 월 상태
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // 공연 기간 계산 (가장 빠른 날짜와 가장 늦은 날짜)
  const [performancePeriod, setPerformancePeriod] = useState({
    startDate: null,
    endDate: null,
  });
  const scrollToMap = () => {
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  useEffect(() => {
    getConcertByCno(cno).then((i) => {
      setPerformance(i);
      console.log(i);

      // 공연 기간 계산
      if (i.schedulesDtoList && i.schedulesDtoList.length > 0) {
        const startTimes = i.schedulesDtoList.map((s) => new Date(s.startTime));
        const startDate = new Date(Math.min(...startTimes));
        const endDate = new Date(Math.max(...startTimes));

        setPerformancePeriod({
          startDate,
          endDate,
        });

        // 회차가 있는 첫 날짜로 캘린더 이동하고 선택
        setCurrentMonth(startDate.getMonth() + 1);
        setCurrentYear(startDate.getFullYear());
        setSelectedDate(startDate);

        // 첫 회차 선택 (available 상태인 첫 회차 선택)
        const firstAvailableSchedule = i.schedulesDtoList.find((s) => {
          const scheduleDate = new Date(s.startTime);
          return (
            scheduleDate.getDate() === startDate.getDate() &&
            scheduleDate.getMonth() === startDate.getMonth() &&
            scheduleDate.getFullYear() === startDate.getFullYear() &&
            s.status === "AVAILABLE"
          );
        });

        if (firstAvailableSchedule) {
          setSelectedSchedule(firstAvailableSchedule.scheduleId);
        }
      }
    });
  }, [cno]);

  // 달력 생성 함수
  const generateCalendar = () => {
    const today = new Date();
    const year = currentYear;
    const month = currentMonth - 1; // JavaScript의 월은 0부터 시작

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const calendar = [];

    // 요일 헤더
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

    // 달력 날짜 생성
    let day = 1;
    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDayOfMonth) || day > daysInMonth) {
          week.push(null);
        } else {
          // 공연 일정이 있는지 확인
          const currentDate = new Date(year, month, day);
          const schedulesForDay = performance.schedulesDtoList.filter(
            (schedule) => {
              const scheduleDate = new Date(schedule.startTime);
              return (
                scheduleDate.getDate() === day &&
                scheduleDate.getMonth() === month &&
                scheduleDate.getFullYear() === year
              );
            }
          );

          const hasSchedule = schedulesForDay.length > 0;
          const hasAvailableSchedule = schedulesForDay.some(
            (s) => s.status === "AVAILABLE"
          );
          const allSoldOut = hasSchedule && !hasAvailableSchedule;

          week.push({
            day,
            hasSchedule,
            hasAvailableSchedule,
            allSoldOut,
            isToday:
              today.getDate() === day &&
              today.getMonth() === month &&
              today.getFullYear() === year,
          });
          day++;
        }
      }
      calendar.push(week);
      if (day > daysInMonth) break;
    }

    return (
      <div
        className="border border-gray-200 rounded-md bg-white"
        style={{ maxWidth: "300px" }}
      >
        <div className="flex justify-between items-center p-2 border-b border-gray-200">
          <button
            className="px-2 py-1 bg-gray-50 rounded hover:bg-gray-100"
            onClick={() => navigateMonth(-1)}
          >
            &lt;
          </button>
          <h3 className="text-sm font-medium">
            {year}. {month + 1 < 10 ? `0${month + 1}` : month + 1}
          </h3>
          <button
            className="px-2 py-1 bg-gray-50 rounded hover:bg-gray-100"
            onClick={() => navigateMonth(1)}
          >
            &gt;
          </button>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {weekdays.map((day, index) => (
                <th
                  key={index}
                  className={`p-1 text-xs font-medium ${
                    index === 0
                      ? "text-red-500"
                      : index === 6
                      ? "text-blue-500"
                      : "text-gray-600"
                  }`}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calendar.map((week, weekIndex) => (
              <tr key={weekIndex}>
                {week.map((dayObj, dayIndex) => (
                  <td
                    key={dayIndex}
                    className={`
                      p-1 text-center text-xs relative
                      ${!dayObj ? "bg-gray-50" : ""}
                      ${dayObj?.isToday ? "font-bold" : ""}
                      ${
                        dayObj?.hasSchedule
                          ? "cursor-pointer hover:bg-gray-100"
                          : "text-gray-400"
                      }
                      ${
                        selectedDate &&
                        selectedDate.getDate() === dayObj?.day &&
                        selectedDate.getMonth() === month &&
                        selectedDate.getFullYear() === year
                          ? "bg-orange-400 text-white rounded-full"
                          : ""
                      }
                      ${
                        dayIndex === 0
                          ? "text-red-500"
                          : dayIndex === 6
                          ? "text-blue-500"
                          : ""
                      }
                    `}
                    onClick={() => {
                      if (dayObj && dayObj.hasSchedule) {
                        setSelectedDate(new Date(year, month, dayObj.day));
                      }
                    }}
                  >
                    {dayObj?.day}
                    {/* 공연이 있는 날짜 표시 마커 */}
                    {dayObj?.hasSchedule && (
                      <div
                        className={`w-2 h-2 rounded-full absolute left-1/2 bottom-0 transform -translate-x-1/2 ${
                          dayObj.allSoldOut ? "bg-red-500" : "bg-green-500"
                        }`}
                      ></div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // 이전/다음 달로 이동
  const navigateMonth = (step) => {
    let newMonth = currentMonth + step;
    let newYear = currentYear;

    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  // 선택된 날짜의 회차 표시
  const renderSchedules = () => {
    if (!selectedDate) return null;

    const dateSchedules = performance.schedulesDtoList.filter((schedule) => {
      const scheduleDate = new Date(schedule.startTime);
      return (
        scheduleDate.getDate() === selectedDate.getDate() &&
        scheduleDate.getMonth() === selectedDate.getMonth() &&
        scheduleDate.getFullYear() === selectedDate.getFullYear()
      );
    });

    if (dateSchedules.length === 0)
      return (
        <p className="text-gray-500 mt-3">
          선택한 날짜에 예매 가능한 회차가 없습니다.
        </p>
      );

    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {dateSchedules.map((schedule, index) => {
          const startTime = new Date(schedule.startTime);
          const hours = startTime.getHours();
          const minutes = startTime.getMinutes();
          const formattedTime = `${hours < 10 ? "0" + hours : hours}:${
            minutes < 10 ? "0" + minutes : minutes
          }`;

          const isSoldOut = schedule.status === "SOLD_OUT";

          return (
            <button
              key={schedule.scheduleId}
              className={`
                py-2 px-3 border rounded-md text-xs relative
                ${
                  isSoldOut
                    ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                    : selectedSchedule === schedule.scheduleId
                    ? "bg-orange-400 text-white border-orange-400"
                    : "border-gray-300 hover:bg-gray-50 text-gray-800"
                }
              `}
              onClick={() =>
                !isSoldOut && setSelectedSchedule(schedule.scheduleId)
              }
              disabled={isSoldOut}
            >
              {index + 1}회 {formattedTime}
              {/* 매진 표시 대각선 */}
              {isSoldOut && (
                <>
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                      <div className="h-px w-full bg-red-500 transform rotate-45 origin-center"></div>
                    </div>
                  </div>
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 text-xs font-medium bg-white px-1">
                    매진
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  // 날짜 포맷팅 함수
  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 설명 텍스트 줄바꿈 처리
  const formatDescription = (text) => {
    if (!text) return "";
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  // 예매하기 버튼 클릭 핸들러
  const handleBooking = () => {
    if (!selectedSchedule) {
      alert("회차를 선택해주세요.");
      return;
    }

    // 선택된 회차가 매진인지 확인
    const selectedScheduleData = performance.schedulesDtoList.find(
      (s) => s.scheduleId === selectedSchedule
    );

    if (selectedScheduleData && selectedScheduleData.status === "SOLD_OUT") {
      alert("매진된 회차입니다. 다른 회차를 선택해주세요.");
      return;
    }
    if (loginUser) {
      navigate(`/reservation/booking/${cno}`, {
        state: {
          schedule: selectedScheduleData,
        },
      });
    } else {
      alert("로그인 후 이용해주세요.");
      navigate("/member/login", { state: { from: location.pathname } });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <MainMenubar currentPage={`/reservation/read/${cno}`} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 공연 정보 영역 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* 공연 제목 */}
          <div className="border-b border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {performance.cname}
            </h1>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* 공연 이미지 */}
              <div className="md:w-1/3">
                <div className="overflow-hidden rounded-lg shadow-md">
                  <img
                    src={
                      !performance.uploadFileName
                        ? "/images/defalt.png"
                        : `http://localhost:8089/concert/view/${performance.uploadFileName}`
                    }
                    alt={performance.cname}
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* 공연 상세 정보 */}
              <div className="md:w-2/3">
                <div className="border rounded-lg bg-gray-50 mb-6">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 text-gray-500 w-32">제목</td>
                        <td className="py-3 px-4 font-medium">
                          {performance.cname}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 text-gray-500 w-32">장소</td>
                        <td className="py-3 px-4 font-medium">
                          <button
                            onClick={scrollToMap}
                            className="flex items-center gap-2 text-orange-400 hover:text-orange-600 hover:underline cursor-pointer focus:outline-none"
                            aria-label="공연장 위치 보기"
                          >
                            <img
                              src="/images/icon8.png"
                              alt=""
                              className="inline-block"
                            />
                            <span className="inline-block">
                              {performance.cplace}
                            </span>
                          </button>
                        </td>
                      </tr>
                      {performance.cprice && (
                        <tr className="border-b border-gray-200">
                          <td className="py-3 px-4 text-gray-500">가격</td>
                          <td className="py-3 px-4 font-medium">
                            {performance.cprice}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td className="py-3 px-4 text-gray-500">공연기간</td>
                        <td className="py-3 px-4 font-medium">
                          {performancePeriod.startDate &&
                          performancePeriod.endDate
                            ? `${formatDate(
                                performancePeriod.startDate
                              )} ~ ${formatDate(performancePeriod.endDate)}`
                            : "정보 없음"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 예매 캘린더 및 회차 선택 */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2">
                    <h3 className="text-base font-medium mb-3">관람일</h3>
                    <div>
                      {generateCalendar()}
                      <div className="mt-2 flex gap-4 text-xs">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                          <span>예매 가능</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                          <span>매진</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <h3 className="text-base font-medium mb-3">회차</h3>
                    {renderSchedules()}
                  </div>
                </div>

                <button
                  className={`
                    w-full py-3 mt-6 rounded-md font-medium text-white shadow-sm
                    ${
                      !selectedSchedule
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-orange-400 hover:bg-orange-700"
                    }
                  `}
                  onClick={handleBooking}
                  disabled={!selectedSchedule}
                >
                  예매하기
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 공연 상세 정보 탭 */}
        <div className="mt-8 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="px-6">
              <button className="py-4 px-2 border-b-2 border-orange-400 font-medium text-orange-400">
                공연정보
              </button>
            </div>
          </div>

          <div className="p-6 prose max-w-none">
            {formatDescription(performance.cdesc)}
          </div>
        </div>
        <div
          ref={mapSectionRef}
          id="map-section"
          className="mt-8 bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div className="border-b border-gray-200">
            <div className="px-6">
              <button className="py-4 px-2 border-b-2 border-orange-400 font-medium text-orange-400">
                공연장 위치
              </button>
            </div>
          </div>
          <div className="p-6" id="kakaomap">
            <KakaoMapComponent place={performance.cplace} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadComponent;
