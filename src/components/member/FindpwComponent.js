import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineUser, HiOutlineMail } from "react-icons/hi";

function FindpwComponent() {
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8089/user/send-reset-link`,
        {
          userId: id,
          userEmail: email,
        }
      );

      setMessage("비밀번호 재설정 링크가 이메일로 전송되었습니다.");
    } catch (error) {
      if (error.response?.data?.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage("서버 오류가 발생했습니다.");
      }
      console.error("error", error);
    }
  };

  return (
    <div className="w-full max-w-xl p-20 bg-white rounded-2xl shadow-2xl border">
      <h2 className="text-3xl font-bold text-orange-500 text-center mb-6">
        비밀번호 찾기
      </h2>

      <form onSubmit={handleSubmit}>
        {/* 아이디 입력 */}
        <div className="mb-6">
          <label
            htmlFor="id"
            className="block text-gray-700 font-semibold mb-2"
          >
            아이디
          </label>
          <div className="relative">
            <HiOutlineUser className="absolute left-3 top-3 text-orange-400 text-xl" />
            <input
              type="text"
              id="id"
              placeholder="아이디를 입력해주세요"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
              autoComplete="off"
              className="w-full py-3 pl-10 pr-3 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-lg transition"
            />
          </div>
        </div>

        {/* 이메일 입력 */}
        <div className="mb-8">
          <label
            htmlFor="email"
            className="block text-gray-700 font-semibold mb-2"
          >
            이메일
          </label>
          <div className="relative">
            <HiOutlineMail className="absolute left-3 top-3 text-orange-400 text-xl" />
            <input
              type="email"
              id="email"
              placeholder="사용하는 이메일을 입력해주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
              className="w-full py-3 pl-10 pr-3 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-lg transition"
            />
          </div>
        </div>

        {/* 메시지 표시 */}
        {message && (
          <div
            className={`mb-4 text-center text-sm font-semibold ${
              message.includes("전송되었습니다")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-orange-400 text-white text-lg font-bold rounded-lg hover:bg-orange-500 transition duration-300"
        >
          비밀번호 재설정 링크 요청
        </button>
      </form>

      <div className="flex justify-center items-center text-xs text-center mt-6 space-x-2">
        <Link to="/member/findid" className="text-gray-600 hover:underline">
          아이디 찾기
        </Link>
        <span>|</span>
        <Link to="/member/login" className="text-gray-600 hover:underline">
          로그인 화면으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default FindpwComponent;
