import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPasswordComponent = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8089/user/reset-password",
        {
          token,
          password: newPassword,
        }
      );

      alert("비밀번호가 성공적으로 변경되었습니다!");
      navigate("/member/login");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "비밀번호 변경 실패");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">비밀번호 재설정</h2>
      {message && <p className="text-red-500 text-sm mb-3">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="새 비밀번호를 입력하세요"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="w-full py-2 bg-orange-400 hover:bg-orange-500 text-white font-bold rounded"
        >
          비밀번호 재설정
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordComponent;
