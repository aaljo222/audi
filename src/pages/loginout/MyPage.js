import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainMenubar from "../../components/menu/MainMenubar";
import MyPageComponent from "../../components/member/MyPageComponent";
import { jwtDecode } from "jwt-decode";
import ProfileImageModal from "../../components/customModal/ProfileImageModal";
import {
  getProfile,
  updateProfileImage,
  deleteProfileImage,
} from "../../api/memberApi";

const MyPage = () => {
  const { userId } = useParams();
  const [data, setData] = useState("orders");
  const [userData, setUserData] = useState({});
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const response = await getProfile(userId);
      setUserData(response);
    } catch (error) {
      console.error("프로필 정보 가져오기 실패:", error);
    }
  };

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
      fetchUserData();
    } catch (error) {
      console.error("토큰 검증 오류:", error);
      alert("인증 정보가 유효하지 않습니다.");
      localStorage.clear();
      navigate("/");
    }
  }, [userId, navigate]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleEditImage = () => {
    setIsModalOpen(false);
    document.getElementById("fileInput").click();
  };

  const handleDeleteImage = async () => {
    setLoading(true);
    try {
      await deleteProfileImage(userId);
      setNewProfileImage(null);
      fetchUserData();
      alert("프로필 이미지가 삭제되었습니다.");
    } catch (error) {
      console.error("프로필 이미지 삭제 실패:", error);
      alert("프로필 이미지 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewProfileImage(URL.createObjectURL(file));
      uploadProfileImage(file);
    }
  };

  const uploadProfileImage = async (file) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      await updateProfileImage(userId, formData);
      fetchUserData();
      alert("프로필 이미지가 변경되었습니다.");
    } catch (error) {
      console.error("프로필 이미지 업데이트 실패:", error);
      alert("프로필 이미지 변경에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const sidebar = [
    {
      id: "account",
      label: "이용 내역",
      items: [
        { id: "orders", label: "주문내역" },
        { id: "reservation", label: "예매내역" },
        { id: "reviews", label: "내 리뷰" },
      ],
    },
    {
      id: "finance",
      label: "포인트",
      items: [{ id: "point", label: "포인트 내역" }],
    },
    {
      id: "settings",
      label: "계정 관리",
      items: [
        { id: "settings", label: "내 정보 수정" },
        { id: "deleteMember", label: "회원탈퇴" },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <MainMenubar />
      <div className="flex bg-gray-100">
        <aside
          className="fixed top-[120px] left-[2%] transition-all duration-1000 ease-in-out bg-white shadow-xl rounded-xl p-6 z-40 flex-shrink-0 
min-w-[450px] max-w-sm w-[2%] h-[calc(100vh-154px)] overflow-y-auto"
        >
          {/* 마이페이지 타이틀 */}
          <h2 className="text-3xl font-bold  mb-4 select-none text-center">
            마이페이지
          </h2>

          {/* 프로필 정보 섹션 */}
          <div className="flex flex-col items-center mb-8 border-b border-gray-200 pb-6">
            {/* 프로필 이미지 */}
            <div className="relative mb-4">
              {!userData.profileImagePath ? (
                <div
                  className="w-32 h-32 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center cursor-pointer shadow-sm"
                  onClick={handleImageClick}
                >
                  <svg
                    className="w-40 h-40 text-gray-400 -translate-y-1"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="50" cy="35" r="18" fill="currentColor" />
                    <path
                      d="M25 90 L25 75 C25 55 75 55 75 75 L75 90 Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              ) : (
                <img
                  src={
                    newProfileImage ||
                    `http://localhost:8089/api/member/profile-image/${
                      userData.profileImagePath
                    }?t=${new Date().getTime()}`
                  }
                  alt="프로필 사진"
                  className="w-32 h-32 rounded-full object-cover border-3 border-white shadow-sm cursor-pointer"
                  onClick={handleImageClick}
                />
              )}
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            {/* 사용자 정보 */}
            <div className="text-center w-full">
              <h3 className="text-xl font-medium text-gray-800 mb-1">
                {userData.userName}
              </h3>
              {/* <p className="text-sm text-gray-600 mb-1">{userData.userId}</p> */}
              <p className="text-sm text-gray-500 overflow-hidden text-ellipsis">
                {userData.userEmail}
              </p>
            </div>

            {/* 파일 input (보이지 않게 설정) */}
            <input
              type="file"
              id="fileInput"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <nav className="select-none space-y-4">
            {sidebar.map((category) => (
              <div key={category.id} className="mb-5">
                <h3 className="text-md uppercase tracking-wider font-semibold mb-3 pl-2">
                  {category.label}
                </h3>
                <ul className="border-l-2 border-gray-200">
                  {category.items.map((item) => (
                    <li key={item.id}>
                      <button
                        className={`w-full text-left pl-4 py-3 relative ${
                          data === item.id
                            ? "text-orange-500 font-medium border-l-2 border-orange-500 -ml-0.5"
                            : "hover:text-orange-500"
                        }`}
                        onClick={() => setData(item.id)}
                      >
                        {item.label}
                        {data === item.id && (
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-orange-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="ml-[20%] lg:ml-[25%] flex-grow bg-gray-100 p-8 min-h-screen">
          <MyPageComponent data={data} userId={userId} />
        </main>
      </div>

      <ProfileImageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEdit={handleEditImage}
        onDelete={handleDeleteImage}
      />
    </div>
  );
};

export default MyPage;
