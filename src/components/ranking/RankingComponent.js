import React, { useEffect, useRef, useState } from "react";
import MainMenubar from "../menu/MainMenubar";
import { getList } from "../../api/concertApi";
import { useNavigate } from "react-router-dom";
import { FaCrown, FaMedal, FaTicketAlt } from "react-icons/fa";
const categories = [
  { id: "전체", name: "전체" },
  { id: "뮤지컬", name: "뮤지컬" },
  { id: "콘서트", name: "콘서트" },
  { id: "연극", name: "연극" },
  { id: "클래식", name: "클래식" },
];

const RankingComponent = () => {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [rankingData, setRankingData] = useState([]);

  useEffect(() => {
    videoRef.current.play();
  }, []);

  useEffect(() => {
    const pageRequestDTO = { page: 1, size: 50 }; // 최대 50개 데이터 요청
    if (selectedCategory !== "전체") pageRequestDTO.category = selectedCategory;
    getList(pageRequestDTO, selectedCategory)
      .then((data) => {
        // salesCount 내림차순으로 정렬
        const sortedData = data.dtoList.sort(
          (a, b) => b.salesCount - a.salesCount
        );
        setRankingData(sortedData || []);
        console.log(data);
      })
      .catch((err) => console.error("랭킹 데이터 불러오기 실패", err));
  }, [selectedCategory]);

  const top3 = rankingData.slice(0, 3); // 상위 3개
  const rest = rankingData.slice(3, 50); // 4위부터 50위까지

  return (
    <div className="bg-white min-h-screen">
      <MainMenubar currentPage="/ranking" />

      {/* 상단 영상 */}
      <div className="mt-24 relative flex items-center justify-center h-[40vh] w-full bg-cover bg-center overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          src="/videos/reservation.mp4"
          loop
          playsInline
          autoPlay
          muted
        />
        <div className="absolute inset-0 bg-[#ad9e87] opacity-30" />
        <div className="relative text-center z-10 flex flex-col items-center text-white font-bold text-3xl uppercase tracking-widest lg:text-4xl">
          Reservation Ranking
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-screen-xl mx-auto px-4 py-10">
        {/* 카테고리 메뉴 */}
        <div className="max-w-screen-xl mx-auto px-4 pb-4">
          <div className="flex flex-wrap justify-center items-center space-x-2 md:space-x-4 border-b border-gray-200 pb-4">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 text-sm md:text-base font-medium rounded-md transition-all duration-200 ${
                  selectedCategory === category.id
                    ? "text-orange-400 border-b-2 border-orange-400"
                    : "text-gray-600 hover:text-orange-600"
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* 상위 3개 랭킹 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-10">
          {top3.map((concert, index) => (
            <div
              key={concert.cno}
              className={`relative bg-white rounded-xl shadow-md cursor-pointer transform hover:scale-90 transition scale-[0.7] ${
                index === 0
                  ? "border-black"
                  : index === 1
                  ? "border-black"
                  : "border-black"
              }`}
              onClick={() => navigate(`/reservation/read/${concert.cno}`)}
            >
              <div className="relative">
                <img
                  src={
                    concert.uploadFileName
                      ? `http://localhost:8089/concert/view/${concert.uploadFileName}`
                      : "/images/defalt.png"
                  }
                  alt={concert.cname}
                  className="w-full h-[60vh] object-cover rounded-t-xl"
                />
                <div className="absolute top-2 left-2 flex items-center gap-2 text-white text-xl font-bold bg-black bg-opacity-30 p-2 rounded-md">
                  {index === 0 && (
                    <FaCrown className="text-yellow-300 text-3xl" />
                  )}
                  {index === 1 && (
                    <FaMedal className="text-gray-300 text-3xl" />
                  )}
                  {index === 2 && (
                    <FaMedal className="text-orange-400 text-3xl" />
                  )}
                  <span>{index + 1}위</span>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {concert.cname}
                </h3>
                <p className="text-lg text-gray-500 truncate">
                  장소: {concert.cplace || "정보 없음"}
                </p>
                <p className="text-sm text-gray-500">
                  {concert.startTime} ~ {concert.endTime}
                </p>

                {/* 예매율 바와 판매량 표시 */}
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-1">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${concert.reserveRate || 0}%`,
                        backgroundColor:
                          concert.reserveRate >= 50 ? "green" : "red",
                      }}
                    />
                    <span className="text-sm text-gray-600">
                      예매율: {concert.reserveRate || "0.0"}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <FaTicketAlt />
                    <span>{concert.salesCount || 0} 티켓 판매</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4위 이후 랭킹 리스트 */}
        <div className="space-y-4">
          {rest.length === 0 ? (
            <p className="text-gray-500 text-center">데이터가 없습니다.</p>
          ) : (
            rest.map((concert, index) => (
              <div
                key={concert.cno}
                className="flex items-center gap-4 p-4 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
                onClick={() => navigate(`/reservation/read/${concert.cno}`)}
              >
                <div className="text-2xl font-extrabold text-orange-500 w-12 text-center">
                  {index + 4}
                </div>
                <img
                  src={
                    concert.uploadFileName
                      ? `http://localhost:8089/concert/view/${concert.uploadFileName}`
                      : "/images/defalt.png"
                  }
                  alt={concert.cname}
                  className="w-20 h-28 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-800 truncate">
                    {concert.cname}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    장소: {concert.cplace || "정보 없음"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {concert.startTime} ~ {concert.endTime}
                  </p>
                </div>
                {/* 티켓 판매 수량 표시로 수정 */}
                <div className="text-sm text-orange-500 font-medium text-right">
                  {concert.salesCount || 0} 티켓 판매
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RankingComponent;
