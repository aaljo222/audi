import React, { useState, useEffect } from "react";
import { updateProfile } from "../../api/memberApi";

const MyPageModify = ({ userData, refreshData, userId }) => {
  const [modifiedUserData, setModifiedUserData] = useState({
    userId: "",
    userName: "",
    userEmail: "",
    userAddress: "",
    userPhoneNum: "",
  });

  const [phoneError, setPhoneError] = useState("");

  // 전화번호 포맷: 010-1234-5678
  const formatPhoneNumber = (phone) => {
    if (!phone) return "010-";

    let digits = phone.replace(/[^0-9]/g, "").replace(/^010/, "");
    digits = digits.substring(0, 8);

    if (digits.length > 4) {
      return `010-${digits.slice(0, 4)}-${digits.slice(4)}`;
    } else {
      return `010-${digits}`;
    }
  };

  useEffect(() => {
    if (userData) {
      const phone = userData.userPhoneNum?.trim() || "";

      setModifiedUserData({
        userId: userData.userId?.trim() || "",
        userName: userData.userName?.trim() || "",
        userEmail: userData.userEmail?.trim() || "",
        userAddress: userData.userAddress?.trim() || "",
        userPhoneNum: phone ? formatPhoneNumber(phone) : "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "userPhoneNum") {
      if (value.length === 1 && value !== "0") {
        newValue = "010-" + value;
      } else {
        newValue = formatPhoneNumber(value);
      }

      const isValidLength = newValue.length === 13;
      if (newValue === "010-" || newValue === "" || !isValidLength) {
        setPhoneError("올바른 휴대폰 입력이 아닙니다.");
      } else {
        setPhoneError("");
      }
    }

    setModifiedUserData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { userName, userEmail, userAddress, userPhoneNum } = modifiedUserData;
    const trimmedPhone = userPhoneNum.trim();

    const isInvalidPhone =
      trimmedPhone === "010-" ||
      trimmedPhone === "" ||
      trimmedPhone.length !== 13;

    if (
      !userName.trim() ||
      !userEmail.trim() ||
      !userAddress.trim() ||
      isInvalidPhone
    ) {
      if (isInvalidPhone) {
        setPhoneError("올바른 휴대폰 입력이 아닙니다.");
      }
      alert("모든 필수 정보를 정확히 입력해주세요.");
      return;
    }

    const trimmedData = {
      userId: modifiedUserData.userId.trim(),
      userName: userName.trim(),
      userEmail: userEmail.trim(),
      userAddress: userAddress.trim(),
      userPhoneNum: trimmedPhone,
    };

    try {
      await updateProfile(userId, trimmedData);
      refreshData(trimmedData);
      alert("회원정보가 수정되었습니다.");
      refreshData();
    } catch (error) {
      alert("수정 중 오류가 발생했습니다");
      console.error(error);
    }
  };

  return (
    // <div className="flex justify-end ml-20 min-h-[92vh] ">
    <div className="flex justify-end ml-[1rem] mt-[0.5rem] min-h-[92vh] select-none">
      <div className="bg-white p-8 rounded-lg shadow-lg mt-20 w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4 select-none">
          회원정보 수정
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-8 mb-6 pl-32">
            <label
              htmlFor="userId"
              className="block text-sm font-semibold text-gray-700 select-none"
            >
              아이디(수정 X):
            </label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={modifiedUserData.userId}
              className="w-3/5 p-3 mt-2 rounded-md border focus:outline-none cursor-default"
              readOnly
            />
          </div>

          <div className="mb-6 pl-32">
            <label
              htmlFor="userName"
              className="block text-sm font-semibold text-gray-700 select-none"
            >
              이름<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={modifiedUserData.userName}
              onChange={handleChange}
              className="w-3/5 p-3 mt-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="mb-6 pl-32">
            <label
              htmlFor="userEmail"
              className="block text-sm font-semibold text-gray-700 select-none"
            >
              이메일<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              value={modifiedUserData.userEmail}
              onChange={handleChange}
              className="w-3/5 p-3 mt-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="mb-6 pl-32">
            <label
              htmlFor="userAddress"
              className="block text-sm font-semibold text-gray-700 select-none"
            >
              주소<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="userAddress"
              name="userAddress"
              value={modifiedUserData.userAddress}
              onChange={handleChange}
              className="w-3/5 p-3 mt-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="mb-6 pl-32">
            <label
              htmlFor="userPhoneNum"
              className="block text-sm font-semibold text-gray-700 select-none"
            >
              전화번호<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="userPhoneNum"
              name="userPhoneNum"
              value={modifiedUserData.userPhoneNum}
              onChange={handleChange}
              placeholder="휴대폰 번호를 입력해주세요"
              className={`w-3/5 p-3 mt-2 rounded-md border focus:outline-none focus:ring-2 ${
                phoneError
                  ? "border-red-500 ring-red-300"
                  : "focus:ring-orange-400"
              }`}
              maxLength="13"
            />
            {phoneError && (
              <p className="text-red-500 text-sm mt-1">{phoneError}</p>
            )}
          </div>

          <div className="pl-32">
            <button
              type="submit"
              className="w-3/5 py-3 mt-4 bg-orange-400 hover:bg-[#E87A2D] text-white font-semibold rounded-md select-none"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyPageModify;
