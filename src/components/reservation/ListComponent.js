import React, { useEffect, useRef, useState } from "react";
import MainMenubar from "../menu/MainMenubar";
import { getList } from "../../api/concertApi";
import { useNavigate } from "react-router-dom";
import PageComponent from "../common/PageComponent"; // 페이지 컴포넌트 import

// 카테고리 목록 (실제 데이터의 category 값에 맞춤)
const categories = [
  { id: "전체", name: "전체" },
  { id: "뮤지컬", name: "뮤지컬" },
  { id: "연극", name: "연극" },
  { id: "클래식", name: "클래식" },
  { id: "콘서트", name: "콘서트" },
];

const ListComponent = () => {
  const videoRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 추가
  const navigate = useNavigate();

  const [concertData, setConcertData] = useState({
    dtoList: [],
    pageRequestDTO: {},
    totalCount: 0,
    pageNumList: [],
    prev: false,
    next: false,
    prevPage: 0,
    nextPage: 0,
    totalPage: 1,
    current: 1,
  });

  useEffect(() => {
    const video = videoRef.current;
    video.play();
  }, []);

  // 페이지나 카테고리 변경 시 데이터 다시 불러오기
  useEffect(() => {
    // PageRequestDTO 객체 생성
    const pageRequestDTO = {
      page: currentPage,
      size: 10,
    };

    if (selectedCategory !== "전체") {
      pageRequestDTO.category = selectedCategory;
    }

    getList(pageRequestDTO, selectedCategory)
      .then((data) => {
        setConcertData(data);
        console.log(data.dtoList);
      })
      .catch((error) => {
        console.error("공연 목록 불러오기 실패:", error);
      });
  }, [currentPage, selectedCategory]);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // 페이지 변경 시 상단으로 스크롤
    window.scrollTo(0, 0);
  };

  // 선택된 카테고리에 따라 콘서트 필터링
  // 서버에서 필터링된 결과를 받아오는 경우 이 부분은 필요 없을 수 있음
  const filteredConcerts =
    selectedCategory === "전체"
      ? concertData.dtoList
      : concertData.dtoList.filter(
          (concert) => concert.category === selectedCategory
        );

  return (
    <div className="bg-white min-h-screen">
      <div>
        <MainMenubar currentPage="/reservation/list" />
      </div>

      <div className="mt-24 relative flex items-center justify-center h-[40vh] w-full bg-cover bg-center group overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          src="/videos/reservation.mp4"
          loop
          playsInline
          autoPlay
          muted
        ></video>
        <div className="absolute inset-0 bg-[#ad9e87] opacity-30"></div>
        <div className="relative text-center z-10 flex flex-col items-center text-white font-bold text-3xl uppercase tracking-widest lg:text-4xl">
          Culture And Art
        </div>
      </div>

      {/* 카테고리 네비게이션 */}
      <div className="max-w-screen-xl mx-auto px-4 pt-8 pb-4">
        <div className="flex flex-wrap justify-center items-center space-x-2 md:space-x-4 border-b border-gray-200 pb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 text-sm md:text-base font-medium rounded-md transition-all duration-200 ${
                selectedCategory === category.id
                  ? "text-orange-400 border-b-2 border-orange-400"
                  : "text-gray-600 hover:text-orange-600"
              }`}
              onClick={() => {
                setSelectedCategory(category.id);
                setCurrentPage(1); // 카테고리 변경 시 페이지 초기화
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* 공연 카드 그리드 */}
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {filteredConcerts.length > 0 ? (
            filteredConcerts.map((concert) => (
              <div
                onClick={() => {
                  navigate(`/reservation/read/${concert.cno}`);
                }}
                key={concert.cno}
                className="group border border-[#ad9e87] bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col cursor-pointer"
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={
                      concert.uploadFileName === null
                        ? "/images/defalt.png"
                        : `http://localhost:8089/concert/view/${concert.uploadFileName}`
                    }
                    alt={concert.cname}
                    className="w-full h-full object-fill group-hover:scale-105 transition-all duration-300"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3
                    className="text-base font-bold text-gray-800 mb-2 truncate"
                    title={concert.cname}
                  >
                    {concert.cname}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2 truncate">
                    {concert.cplace || "공연장소"}
                  </p>

                  {/* 날짜 정보가 있으면 표시, 없으면 기본값 표시 */}
                  <p className="text-xs text-gray-400 mb-2">
                    {concert.startTime || "2023.00.00"} -{" "}
                    {concert.endTime || "2023.00.00"}
                  </p>

                  <div className="mt-auto flex justify-between items-center">
                    <p className="text-sm font-bold text-[#2C3E50]">
                      좌석가격: {concert.cprice}
                    </p>
                    {concert.category === "뮤지컬" && (
                      <span className="inline-block bg-orange-100 text-orange-400 text-xs px-2 py-1 rounded-sm">
                        인기공연
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                현재 이 카테고리의 공연이 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 페이지네이션 컴포넌트 */}
      <div className="flex justify-center my-8">
        <PageComponent
          currentPage={concertData.current}
          totalPages={concertData.totalPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ListComponent;
