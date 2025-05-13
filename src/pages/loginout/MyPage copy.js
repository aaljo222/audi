import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainMenubar from "../../components/menu/MainMenubar";
import MyPageComponent from "../../components/member/MyPageComponent";
import { getProfile } from "../../api/memberApi";
import { jwtDecode } from "jwt-decode";
import { FaBars, FaTimes } from "react-icons/fa";

const MyPage = () => {
  const { userId } = useParams();
  const [data, setData] = useState("orders");
  const [userData, setUserData] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const tokenUserId = decodedToken.userId;

      if (userId !== tokenUserId) {
        alert("접근 권한이 없습니다.");
        localStorage.clear();
        navigate("/");
        return;
      }

      getProfile(userId).then((i) => {
        setUserData(i);
      });
    } catch (error) {
      console.error("토큰 검증 오류:", error);
      alert("인증 정보가 유효하지 않습니다.");
      localStorage.clear();
      navigate("/");
    }
  }, [userId, navigate]);

  const sidebar = [
    { id: "orders", label: "주문내역" },
    { id: "reservation", label: "예약내역" },
    { id: "reviews", label: "내 리뷰" },
    { id: "settings", label: "내 정보 수정" },
    { id: "deleteMember", label: "회원탈퇴" },
  ];

  // 리사이징 이벤트 처리
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <MainMenubar />

      {/* 햄버거 버튼 */}
      <button
        className="fixed top-[100px] left-2 z-50 text-3xl text-gray-700 hover:text-orange-500 transition-colors duration-200"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {!sidebarOpen ? (
          <FaBars />
        ) : (
          <span className="lg:hidden">
            <FaTimes />
          </span>
        )}
      </button>

      <div className="flex bg-gray-100 min-h-screen  pt-[110px]">
        {/* 사이드바 */}
        <aside
          className={`fixed top-[110px] left-[2%] transition-all duration-1000 ease-in-out bg-white shadow-xl rounded-r-xl p-6 z-40 flex-shrink-0 
    min-w-[450px] max-w-sm w-[2%] 
    ${
      sidebarOpen
        ? "translate-x-0 opacity-100"
        : "-translate-x-full opacity-0 lg:translate-x-0 lg:opacity-100"
    }`}
        >
          <h2 className="text-3xl text-center font-bold text-gray-800 mb-6 select-none">
            마이페이지
          </h2>

          {/* 프로필 */}
          <div className="mb-6 p-4 select-none">
            <div className="text-center mb-4 flex flex-col justify-center items-center">
              <img
                src={userData.profileImageUrl || "/images/mainlogo.png"}
                alt="프로필 사진"
                className="w-36 h-36 rounded-full object-cover mb-3 border-4 border-gray-500"
              />
            </div>

            <h3 className="text-xl text-center font-semibold text-gray-800">
              {userData.userName}
            </h3>
            <p className="text-sm text-center text-gray-600">
              아이디: {userData.userId}
            </p>
            <p className="text-sm text-center text-gray-600">
              이메일: {userData.userEmail}
            </p>
          </div>

          {/* 메뉴 */}
          <nav>
            <ul className="space-y-4 select-none">
              {sidebar.map((item) => (
                <li key={item.id}>
                  <button
                    className={`w-full text-left py-3 px-5 text-lg font-semibold relative ${
                      data === item.id ? "text-orange-400" : "text-gray-800"
                    }`}
                    onClick={() => setData(item.id)}
                  >
                    {item.label}
                    {data === item.id && (
                      <span className="absolute bottom-0 left-5 w-3/5 h-[0.5px] bg-orange-400"></span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* 메인 콘텐츠 */}
        <main
          className={`transition-all duration-500 bg-gray-100 p-8 flex-grow 
            ${
              sidebarOpen ? "ml-[1%]" : "ml-0 flex justify-center"
            }min-h-[800px]`}
        >
          <div className={`w-full ${!sidebarOpen ? "max-w-[1024px]" : ""}`}>
            <MyPageComponent data={data} userId={userId} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyPage;
