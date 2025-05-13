import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineMail, HiOutlineUser } from "react-icons/hi";

function FindidComponent() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState(""); // 상태 메시지

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // 메시지 초기화

    try {
      const response = await axios.post(
        `http://localhost:8089/api/member/findId`,
        {
          userName: name,
          userEmail: email,
        }
      );

      if (response.data.success) {
        setUserId(response.data.data);
        setMessage(`${name} 님의 아이디는 ${response.data.data} 입니다.`);
      } else if (response.data.data === "탈퇴한 계정입니다.") {
        setMessage("탈퇴한 계정입니다.");
      } else if (response.data.data === "사용자가 없습니다.") {
        setMessage("해당 사용자를 찾을 수 없습니다.");
      }
    } catch (error) {
      setMessage("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div className="w-full max-w-xl p-20 bg-white rounded-2xl shadow-2xl border">
      <h2 className="text-3xl font-bold text-orange-500 text-center mb-6">
        아이디 찾기
      </h2>

      <form onSubmit={handleSubmit}>
        {/* 이름 입력 */}
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block text-gray-700 font-semibold mb-2"
          >
            이름
          </label>
          <div className="relative">
            <HiOutlineUser className="absolute left-3 top-3 text-orange-400 text-xl" />
            <input
              type="text"
              id="name"
              placeholder="이름을 입력해주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              message.includes("아이디는") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-orange-400 text-white text-lg font-bold rounded-lg hover:bg-orange-500 transition duration-300"
        >
          아이디 찾기
        </button>
      </form>

      <div className="flex justify-center items-center text-xs text-center mt-6 space-x-2">
        <Link to="/member/findpw" className="text-gray-600 hover:underline">
          비밀번호 찾기
        </Link>
        <span>|</span>
        <Link to="/member/login" className="text-gray-600 hover:underline">
          로그인 화면으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default FindidComponent;
