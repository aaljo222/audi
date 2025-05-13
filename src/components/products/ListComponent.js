import { useNavigate } from "react-router-dom";
import { getList } from "../../api/productsApi";
import React, { useEffect, useRef, useState } from "react";
import MainMenubar from "../menu/MainMenubar";
import PageComponent from "../common/PageComponent"; // 페이지 컴포넌트 import

const ListComponent = () => {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const categories = ["전체", "헤드셋", "이어폰", "스피커", "앰프"];

  const [productData, setProductData] = useState({
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

  // 현재 페이지 상태 추가
  const [currentPage, setCurrentPage] = useState(1);

  // 제품 데이터를 가져오는 useEffect - 페이지 변경이나 카테고리 변경 시 재실행
  useEffect(() => {
    getList({ page: currentPage, size: 8 }, selectedCategory)
      .then((data) => {
        console.log(data); // data 확인
        setProductData({
          dtoList: data.dtoList,
          pageRequestDTO: data.pageRequestDTO,
          totalCount: data.totalCount,
          pageNumList: data.pageNumList,
          prev: data.prev,
          next: data.next,
          prevPage: data.prevPage,
          nextPage: data.nextPage,
          totalPage: data.totalPage,
          current: data.pageRequestDTO.page, // 현재 페이지
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [currentPage, selectedCategory]); // 페이지 번호나 카테고리가 변경될 때 데이터를 다시 불러옴

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // 페이지 변경 시 상단으로 스크롤
    window.scrollTo(0, 0);
  };

  const navigate = useNavigate();
  const moveToRead = (pno) => {
    navigate({
      pathname: `../read/${pno}`,
    });
  };

  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    video.play(); // 동영상 자동 재생
  }, []);

  return (
    <div>
      <MainMenubar currentPage="/product/list" />

      <div className="mt-24 relative flex items-center justify-center h-[40vh] w-full bg-cover bg-center group overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          src="/videos/product.mp4"
          loop
          playsInline
          autoPlay
          muted
        ></video>
        <div className="absolute inset-0 bg-[#ad9e87] opacity-30"></div>
        <div className="relative text-center z-10 flex flex-col items-center text-white font-bold text-3xl uppercase tracking-widest lg:text-4xl">
          PRODUCT
        </div>
      </div>

      <div className="bg-white min-h-screen">
        {/* 카테고리 네비게이션 */}
        <div className="max-w-screen-xl mx-auto px-4 pt-8 pb-4">
          <div className="flex flex-wrap justify-center items-center space-x-2 md:space-x-4 border-b border-gray-200 pb-4">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 text-sm md:text-base font-medium rounded-md transition-all duration-200 ${
                  selectedCategory === category
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-600 hover:text-orange-500"
                }`}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1); // 카테고리 변경 시 첫 페이지로 초기화
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 제품 목록 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-screen-xl mx-auto p-6">
          {/* 필터링된 제품 목록 */}
          {productData.dtoList.filter(
            (product) =>
              selectedCategory === "전체" ||
              product.category === selectedCategory
          ).length > 0 ? (
            // 제품이 있는 경우 목록 표시
            productData.dtoList
              .filter(
                (product) =>
                  selectedCategory === "전체" ||
                  product.category === selectedCategory
              )
              .map((product) => (
                <div
                  key={product.pno}
                  className={`bg-white p-4 rounded-lg border border-[#ad9e87] shadow-lg ${
                    product.pstock > 0
                      ? "cursor-pointer hover:shadow-xl transition-shadow duration-300"
                      : "opacity-75"
                  }`}
                  onClick={
                    product.pstock > 0
                      ? () => moveToRead(product.pno)
                      : undefined
                  }
                >
                  <div className="w-full h-52">
                    <img
                      src={
                        product.uploadFileNames &&
                        product.uploadFileNames.length > 0
                          ? `http://localhost:8089/product/view/${product.uploadFileNames[0]}`
                          : "/images/defalt.png"
                      }
                      alt={product.pname}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <hr className="my-2" />
                  <h2 className="text-xl font-semibold mt-2">
                    {product.pname}
                  </h2>
                  <p className="text-gray-500">
                    {product.price.toLocaleString()}
                  </p>
                  {product.pstock <= 0 ? (
                    <p className="text-red-500 font-bold">SoldOut</p>
                  ) : (
                    <p className="text-gray-400">재고: {product.pstock}개</p>
                  )}
                </div>
              ))
          ) : (
            // 제품이 없는 경우 메시지 표시
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                현재 이 카테고리의 상품이 없습니다.
              </p>
            </div>
          )}
        </div>

        {/* 페이지네이션 컴포넌트 */}
        <div className="flex justify-center my-8">
          <PageComponent
            currentPage={productData.current}
            totalPages={productData.totalPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ListComponent;
