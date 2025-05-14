import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, checkId } from "../../api/memberApi";

const SignUpComponent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: "",
    userPw: "",
    userName: "",
    userEmail: "",
    userPhoneNum: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await registerUser(formData);
    if (result.success) {
      alert("회원가입이 완료되었습니다!");
      navigate("/member/login");
    } else {
      alert("회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-md bg-white max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">회원가입</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="userId"
          placeholder="아이디"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />
        <input
          type="password"
          name="userPw"
          placeholder="비밀번호"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />
        <input
          type="text"
          name="userName"
          placeholder="이름"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />
        <input
          type="email"
          name="userEmail"
          placeholder="이메일"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />
        <input
          type="text"
          name="userPhoneNum"
          placeholder="전화번호"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SignUpComponent;
