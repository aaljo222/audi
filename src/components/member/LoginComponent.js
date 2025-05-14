import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginPost } from "../../api/memberApi";
import Signup from "../../components/member/SignupComponent";

const LoginComponent = () => {
  const location = useLocation();
  const from = location.state?.from || "/";
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = useRef(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!userPw) {
      setErrorMessage("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const loginParam = { userId, userPw };
      const response = await loginPost(loginParam);
      const { data } = response;
      if (data === "탈퇴하신분이에요") {
        setErrorMessage("존재하지 않는 계정입니다.");
      } else {
        navigate(from, { state: { isAuthenticated: true } });
      }
    } catch (error) {
      setErrorMessage("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-400 to-blue-600">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-4">AudiMew</h2>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-2 text-center">
            {errorMessage}
          </div>
        )}
        <div className="mb-4">
          <input
            type="text"
            placeholder="아이디를 입력해주세요."
            className="w-full p-2 border rounded focus:outline-none"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div className="mb-4 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호를 입력해주세요."
            className="w-full p-2 border rounded focus:outline-none"
            value={userPw}
            onChange={(e) => setUserPw(e.target.value)}
            ref={passwordInputRef}
          />
          <span
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "숨기기" : "보기"}
          </span>
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
        >
          로그인
        </button>
        <p className="text-center mt-4">
          계정이 없으신가요?{" "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 cursor-pointer"
          >
            회원가입
          </span>
        </p>
        {!isLogin && <Signup />}
      </div>
    </div>
  );
};

export default LoginComponent;
