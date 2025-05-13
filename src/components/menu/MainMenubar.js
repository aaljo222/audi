import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const MainMenubar = ({ currentIndex, currentPage }) => {
  let loginUser = {};

  try {
    const storedUser = localStorage.getItem("user");
    loginUser = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("JSON 파싱 오류:", error);
    loginUser = {}; // 예외 발생 시 기본 값 할당
  }

  const [user, setUser] = useState(loginUser);

  const navigate = useNavigate();

  useEffect(() => {
    setUser(loginUser);
  }, []);

  const handleLogout = async () => {
    const res = await axios.post(`http://localhost:8089/auth/logout`, {
      refreshToken: localStorage.getItem("refreshToken"),
    });
    console.log(res);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");

    navigate(currentPage ? currentPage : "/");
  };

  const handleMyPage = () => {
    if (!loginUser) {
      navigate("/member/login", { state: { from: location.pathname } });
    } else {
      navigate(`/member/mypage/${loginUser.userId}`);
    }
  };

  const handleBasketPage = () => {
    if (loginUser) {
      navigate("/shopping/basket");
    } else {
      navigate("/member/login", { state: { from: location.pathname } });
    }
  };

  const handleAdmin = () => {
    navigate("/admin");
  };

  return (
    <div
      className={`absolute top-0 left-0 w-full h-[10vh] z-50 flex items-center px-5 transition-all duration-500 ${
        currentIndex === 0
          ? "bg-transparent"
          : currentIndex === 3
          ? "bg-white"
          : "bg-[#f1efeb]"
      }`}
    >
      <div className="ml-4">
        <Link
          to={"/"}
          className={`${
            currentIndex === 0
              ? "text-[#EED9C4] font-bold"
              : "text-black font-bold"
          }`}
        >
          <img
            src={`${
              currentIndex === 0
                ? "/images/1stpageLogo.png"
                : "/images/mainlogo.png"
            }`}
            className={`${currentIndex === 0 ? "w-32" : "w-20"}`}
          ></img>
        </Link>
      </div>
      <div className="flex gap-x-6 ml-8">
        <Link
          to="/product"
          className={`${
            currentIndex === 0 ? "text-[#EED9C4]" : "text-black"
          } font-bold hover:text-opacity-80`}
        >
          product shop
        </Link>
        <Link
          to="/reservation"
          className={`${
            currentIndex === 0 ? "text-[#EED9C4]" : "text-black"
          } font-bold hover:text-opacity-80`}
        >
          reservation
        </Link>
        <Link
          to="/ranking"
          className={`${
            currentIndex === 0 ? "text-[#EED9C4]" : "text-black"
          } font-bold hover:text-opacity-80`}
        >
          Reservation Ranking
        </Link>
      </div>

      <div className="flex items-center ml-auto mr-5">
        {loginUser ? (
          <>
            {/* 로그인된 상태에서 admin일 경우 관리자 페이지 버튼, 아니면 MyPage 링크 표시 */}
            <button
              onClick={handleLogout}
              className={`${
                currentIndex === 0
                  ? "text-[#EED9C4] font-bold"
                  : "text-black font-bold"
              } mx-2 relative after:content-['|'] after:absolute after:right-[-12px] after:text-gray-700`}
            >
              LogOut
            </button>

            {loginUser.userId === "admin" ? (
              // admin일 경우 관리자 페이지 버튼만 표시하고, Cart 버튼은 표시하지 않음
              <button
                onClick={handleAdmin}
                className={`${
                  currentIndex === 0
                    ? "text-[#EED9C4] font-bold"
                    : "text-black font-bold"
                } mx-2`}
              >
                Administrator
              </button>
            ) : (
              // admin이 아닌 경우 MyPage 링크 표시
              <Link
                to={`/member/mypage/${loginUser.userId}`}
                className={`${
                  currentIndex === 0
                    ? "text-[#EED9C4] font-bold"
                    : "text-black font-bold"
                } mx-2 relative after:content-['|'] after:absolute after:right-[-12px] after:text-gray-700`}
              >
                MyPage
              </Link>
            )}

            {/* admin이 아닌 경우에만 Cart 버튼 표시 */}
            {loginUser.userId !== "admin" && (
              <button
                onClick={handleBasketPage}
                className={`${
                  currentIndex === 0
                    ? "text-[#EED9C4] font-bold"
                    : "text-black font-bold"
                } mx-2`}
              >
                Cart
              </button>
            )}
          </>
        ) : (
          <>
            {/* 로그인되지 않은 상태에서는 Login, Join, MyPage, Cart 버튼 표시 */}
            <button
              onClick={() => {
                navigate("/member/login", {
                  state: { from: location.pathname },
                });
              }}
              className={`${
                currentIndex === 0
                  ? "text-[#EED9C4] font-bold"
                  : "text-black font-bold"
              } mx-2 relative after:content-['|'] after:absolute after:right-[-12px] after:text-gray-700`}
            >
              Login
            </button>

            {/* 로그인되지 않았을 때는 MyPage와 Cart 버튼도 표시 */}
            <button
              onClick={handleMyPage}
              className={`${
                currentIndex === 0
                  ? "text-[#EED9C4] font-bold"
                  : "text-black font-bold"
              } mx-2 relative after:content-['|'] after:absolute after:right-[-12px] after:text-gray-700`}
            >
              MyPage
            </button>
            <button
              onClick={handleBasketPage}
              className={`${
                currentIndex === 0
                  ? "text-[#EED9C4] font-bold"
                  : "text-black font-bold"
              } mx-2`}
            >
              Cart
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MainMenubar;
