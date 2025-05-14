import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, checkId } from "../../api/memberApi";
import {
  formatPhoneNumber,
  validatePhoneNumber,
  passwordRegex,
} from "../signup/utils";

// Import individual components
import AddressSearch from "../customModal/AddressSearch";

const SignUpComponent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: "",
    userPw: "",
    confirmPassword: "",
    userName: "",
    userEmail: "",
    userEmailId: "",
    userEmailDomain: "",
    userAddress: "",
    userPhoneNum: "",
    agreeAge: false,
    agreeTerms: false,
    agreePrivacy: false,
    agreeComercial: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [idChecked, setIdChecked] = useState(false);
  const [passwordValid, setPasswordValid] = useState(true);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [customDomainInput, setCustomDomainInput] = useState(false);
  const [formattedPhone, setFormattedPhone] = useState("010");
  const [phoneError, setPhoneError] = useState("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Phone number handling logic
    if (name === "userPhoneNum") {
      if (value) {
        let onlyDigits = value.replace(/[^\d]/g, "").slice(0, 11);

        if (!onlyDigits || !onlyDigits.startsWith("010")) {
          onlyDigits = "010";
        }

        const formatted = formatPhoneNumber(onlyDigits);
        const validation = validatePhoneNumber(onlyDigits);

        setFormattedPhone(formatted);
        setPhoneError(validation.message);

        setFormData((prevState) => ({
          ...prevState,
          userPhoneNum: formatted,
        }));
      } else {
        setFormattedPhone("010");
        setPhoneError("");
        setFormData((prevState) => ({
          ...prevState,
          userPhoneNum: "010",
        }));
      }
      return;
    }

    // Email domain special handling
    if (name === "userEmailDomain" && value === "direct") {
      setCustomDomainInput(true);
      setFormData((prevState) => ({
        ...prevState,
        userEmailDomain: "",
      }));
      return;
    }

    setFormData((prevState) => {
      const newState = {
        ...prevState,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "userPw") {
        setPasswordValid(passwordRegex.test(value));
        setPasswordMatch(value === prevState.confirmPassword);
      } else if (name === "confirmPassword") {
        setPasswordMatch(value === prevState.userPw);
      }

      if (name === "userId") {
        setIdChecked(false);
      }

      // Email combination logic
      if (name === "userEmailDomain") {
        newState.userEmail = prevState.userEmailId
          ? `${prevState.userEmailId}@${value}`
          : "";
      } else if (name === "userEmailId") {
        newState.userEmail = prevState.userEmailDomain
          ? `${value}@${prevState.userEmailDomain}`
          : "";
      }

      return newState;
    });
  };

  // Address selection handler
  const handleAddressSelect = (address, zonecode) => {
    setFormData((prevState) => ({
      ...prevState,
      userAddress: address,
    }));
    setIsAddressModalOpen(false);
  };

  const handleUserIdCheck = async () => {
    if (!formData.userId || formData.userId.trim() === "") {
      alert("아이디를 입력해주세요.");
      return;
    }

    const result = await checkId(formData.userId);

    if (result.success) {
      alert("아이디가 사용 가능합니다.");
      setIdChecked(true);
    } else {
      alert("아이디가 중복되었습니다. 다른 아이디를 사용해주세요.");
      setFormData((prevState) => ({
        ...prevState,
        userId: "",
      }));
      setIdChecked(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleCheckAll = (e) => {
    const isChecked = e.target.checked;
    setFormData((prevState) => ({
      ...prevState,
      agreeAge: isChecked,
      agreeTerms: isChecked,
      agreePrivacy: isChecked,
      agreeComercial: isChecked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idChecked) {
      alert("아이디 중복 확인을 해주세요.");
      return;
    }

    if (!formData.userPw || formData.userPw.trim() === "") {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    if (!passwordValid) {
      alert(
        "비밀번호는 6글자 이상, 영어(대소문자 구분 없음), 숫자, 특수문자가 포함되어야 합니다."
      );
      return;
    }

    if (!passwordMatch) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!formData.userName.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    if (!formData.userAddress.trim()) {
      alert("주소를 입력해주세요.");
      return;
    }

    if (!formData.userEmailId || formData.userEmailId.trim() === "") {
      alert("이메일을 제대로 입력해주세요.");
      return;
    }

    if (!formData.userEmailDomain || formData.userEmailDomain.trim() === "") {
      alert("이메일 도메인을 제대로 입력해주세요.");
      return;
    }

    if (formData.userPhoneNum.length < 13) {
      alert("휴대폰 번호가 제대로 입력되지 않았습니다.");
      return;
    }

    if (!formData.agreeAge || !formData.agreeTerms || !formData.agreePrivacy) {
      alert("필수 약관에 동의해야 합니다.");
      return;
    }

    setIsSubmitting(true);

    const filteredData = {
      userId: formData.userId.trim(),
      userPw: formData.userPw,
      userName: formData.userName.trim(),
      userEmail: formData.userEmail.trim(),
      userEmailId: formData.userEmailId.trim(),
      userEmailDomain: formData.userEmailDomain.trim(),
      userAddress: formData.userAddress.trim(),
      userPhoneNum: formData.userPhoneNum,
    };

    const result = await registerUser(filteredData);

    if (result && result.success === true) {
      alert("회원가입이 완료되었습니다!");
      navigate("/member/login");
      window.location.reload();
    } else {
      setError(
        result?.message || "회원가입에 실패했습니다. 다시 시도해 주세요."
      );
    }

    setIsSubmitting(false);
  };

  // Component mounting - set initial values
  useEffect(() => {
    if (formData.userPhoneNum) {
      setFormattedPhone(formatPhoneNumber(formData.userPhoneNum));
    }
  }, []);

  return (
    <div className="w-full">
      {error && <div className="text-red-600 text-sm ml-5 mt-1">{error}</div>}

      {/* User ID Input */}
      <div className="relative w-[90%] mx-auto my-3.5">
        <i className="bx bxs-user absolute top-1/2 left-4 transform -translate-y-1/2 text-xl text-gray-400"></i>
        <div className="flex">
          <input
            type="text"
            name="userId"
            placeholder="아이디를 입력해주세요."
            value={formData.userId}
            onChange={handleChange}
            className="w-full pl-4 py-3 text-sm bg-gray-100 rounded-md border border-white outline-none focus:border-blue-500"
          />
          <button
            type="button"
            onClick={handleUserIdCheck}
            className="ml-2 px-4 py-2 rounded-md bg-blue-500 text-white text-sm outline-none cursor-pointer"
          >
            중복확인
          </button>
        </div>
      </div>

      {/* Password Input */}
      <div className="relative w-[90%] mx-auto my-3.5">
        <i className="bx bxs-lock-alt absolute top-1/2 left-4 transform -translate-y-1/2 text-xl text-gray-400"></i>
        <input
          type={showPassword ? "text" : "password"}
          name="userPw"
          placeholder="비밀번호를 입력해주세요."
          value={formData.userPw}
          onChange={handleChange}
          className="w-full pl-4 py-3 text-sm bg-gray-100 rounded-md border border-white outline-none focus:border-blue-500"
        />
        <span
          className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          <img
            src={showPassword ? "/images/showPw.png" : "/images/hidePw.png"}
            alt="아이콘"
            width="24"
            height="24"
          />
        </span>
      </div>
      {!passwordValid && formData.userPw && (
        <div className="text-red-600 text-xs ml-5 mt-1">
          비밀번호는 6글자 이상, 영어, 숫자, 특수문자가 포함되어야 합니다.
        </div>
      )}

      {/* Confirm Password Input */}
      <div className="relative w-[90%] mx-auto my-3.5">
        <i className="bx bxs-lock-alt absolute top-1/2 left-4 transform -translate-y-1/2 text-xl text-gray-400"></i>
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="비밀번호를 다시 입력해주세요."
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full pl-4 py-3 text-sm bg-gray-100 rounded-md border border-white outline-none focus:border-blue-500"
        />
        <span
          className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={toggleConfirmPasswordVisibility}
        >
          <img
            src={
              showConfirmPassword ? "/images/showPw.png" : "/images/hidePw.png"
            }
            alt="아이콘"
            width="24"
            height="24"
          />
        </span>
      </div>
      {!passwordMatch && formData.confirmPassword && (
        <div className="text-red-600 text-xs ml-5 mt-1">
          비밀번호가 일치하지 않습니다.
        </div>
      )}

      {/* Name Input */}
      <div className="relative w-[90%] mx-auto my-3.5">
        <i className="bx bxs-user absolute top-1/2 left-4 transform -translate-y-1/2 text-xl text-gray-400"></i>
        <input
          type="text"
          name="userName"
          placeholder="이름을 입력해주세요."
          value={formData.userName}
          onChange={handleChange}
          className="w-full pl-4 py-3 text-sm bg-gray-100 rounded-md border border-white outline-none focus:border-blue-500"
        />
      </div>

      {/* Address Input */}
      <div className="relative w-[90%] mx-auto my-3.5">
        <i className="bx bxs-home absolute top-1/2 left-4 transform -translate-y-1/2 text-xl text-gray-400"></i>
        <div className="flex">
          <input
            type="text"
            name="userAddress"
            placeholder="주소를 입력해주세요."
            value={formData.userAddress}
            onChange={handleChange}
            readOnly
            className="w-full pl-4 py-3 text-sm bg-gray-100 rounded-md border border-white outline-none focus:border-blue-500"
          />
          <button
            type="button"
            onClick={() => setIsAddressModalOpen(true)}
            className="ml-2 px-4 py-2 rounded-md bg-blue-500 text-white text-sm outline-none cursor-pointer"
          >
            주소검색
          </button>
        </div>
      </div>

      {/* Email Input */}
      <div className="relative w-[90%] mx-auto my-3.5">
        <i className="bx bxs-envelope absolute top-1/2 left-4 transform -translate-y-1/2 text-xl text-gray-400"></i>
        <div className="flex ml-5 w-full">
          <input
            type="text"
            name="userEmailId"
            placeholder="이메일"
            value={formData.userEmailId}
            onChange={handleChange}
            className="w-[45%] py-3 text-sm bg-gray-100 rounded-md border border-white outline-none focus:border-blue-500"
          />
          <span className="mx-1 self-center">@</span>
          {customDomainInput ? (
            <input
              type="text"
              name="userEmailDomain"
              placeholder="도메인"
              value={formData.userEmailDomain}
              onChange={handleChange}
              className="w-[45%] py-3 text-sm bg-gray-100 rounded-md border border-white outline-none focus:border-blue-500"
            />
          ) : (
            <select
              name="userEmailDomain"
              value={formData.userEmailDomain}
              onChange={handleChange}
              className="w-[45%] py-3 px-3 rounded-md border border-white bg-gray-100 outline-none"
            >
              <option value="">도메인 선택</option>
              <option value="naver.com">naver.com</option>
              <option value="gmail.com">gmail.com</option>
              <option value="daum.net">daum.net</option>
              <option value="hanmail.net">hanmail.net</option>
              <option value="nate.com">nate.com</option>
              <option value="direct">직접 입력</option>
            </select>
          )}
        </div>
      </div>

      {/* Phone Input */}
      <div className="relative w-[90%] mx-auto my-3.5">
        <i className="bx bxs-phone absolute top-1/2 left-4 transform -translate-y-1/2 text-xl text-gray-400"></i>
        <input
          type="tel"
          name="userPhoneNum"
          placeholder="휴대폰 번호를 입력해주세요."
          value={formattedPhone}
          onChange={handleChange}
          className="w-full pl-4 py-3 text-sm bg-gray-100 rounded-md border border-white outline-none focus:border-blue-500"
        />
      </div>
      {phoneError && (
        <div className="text-red-600 text-xs ml-5 mt-1">{phoneError}</div>
      )}

      {/* Agreement Section */}
      <div className="w-[90%] mx-auto my-4">
        <div className="flex items-center my-2 ml-5">
          <label className="flex items-center text-sm cursor-pointer">
            <input
              type="checkbox"
              className="mr-2"
              checked={
                formData.agreeAge &&
                formData.agreeTerms &&
                formData.agreePrivacy &&
                formData.agreeComercial
              }
              onChange={handleCheckAll}
            />
            전체 동의
          </label>
        </div>

        <div className="flex items-center my-2 ml-5">
          <label className="flex items-center text-sm cursor-pointer">
            <input
              type="checkbox"
              name="agreeAge"
              className="mr-2"
              checked={formData.agreeAge}
              onChange={handleChange}
            />
            <span>
              만 14세 이상입니다 <span className="text-red-500">(필수)</span>
            </span>
          </label>
        </div>

        <div className="flex items-center my-2 ml-5">
          <label className="flex items-center text-sm cursor-pointer">
            <input
              type="checkbox"
              name="agreeTerms"
              className="mr-2"
              checked={formData.agreeTerms}
              onChange={handleChange}
            />
            <span>
              이용약관 <span className="text-red-500">(필수)</span>
            </span>
          </label>
        </div>

        <div className="flex items-center my-2 ml-5">
          <label className="flex items-center text-sm cursor-pointer">
            <input
              type="checkbox"
              name="agreePrivacy"
              className="mr-2"
              checked={formData.agreePrivacy}
              onChange={handleChange}
            />
            <span>
              개인정보 수집/이용 <span className="text-red-500">(필수)</span>
            </span>
          </label>
        </div>

        <div className="flex items-center my-2 ml-5">
          <label className="flex items-center text-sm cursor-pointer">
            <input
              type="checkbox"
              name="agreeComercial"
              className="mr-2"
              checked={formData.agreeComercial}
              onChange={handleChange}
            />
            <span>마케팅 정보 수신 동의 (선택)</span>
          </label>
        </div>
      </div>

      {/* Address Search Modal */}
      <AddressSearch
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onAddressSelect={handleAddressSelect}
      />

      <button
        type="submit"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-[90%] py-2 mx-auto mt-4 mb-6 block rounded-lg border-none bg-blue-500 text-white text-lg outline-none cursor-pointer"
      >
        가입완료
      </button>
    </div>
  );
};

export default SignUpComponent;
