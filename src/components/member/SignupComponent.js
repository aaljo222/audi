import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, checkId } from "../../api/memberApi";
import { SignupButton } from "../signup/styles";
import {
  formatPhoneNumber,
  validatePhoneNumber,
  passwordRegex,
} from "../signup/utils";

// 개별 컴포넌트 임포트
import UserIdInput from "../signup/UserIdInput";
import PasswordInput from "../signup/PasswordInput";
import ProfileInputs from "../signup/ProfileInputs";
import EmailInput from "../signup/EmailInput";
import PhoneInput from "../signup/PhoneInput";
import AgreementSection from "../signup/AgreementSection";
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
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false); // 주소 모달 상태 추가

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // 휴대폰 번호 처리 로직
    if (name === "userPhoneNum") {
      // 값이 비어있지 않은 경우에만 처리
      if (value) {
        let onlyDigits = value.replace(/[^\d]/g, "").slice(0, 11);

        // 입력값이 비어있거나 '010'으로 시작하지 않으면 '010' 설정
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
        // 입력값이 완전히 비어있는 경우 기본값 설정
        setFormattedPhone("010");
        setPhoneError("");
        setFormData((prevState) => ({
          ...prevState,
          userPhoneNum: "010",
        }));
      }
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

      // 이메일 조합 로직
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

  // 주소 검색에서 주소가 선택됐을 때 호출될 함수
  const handleAddressSelect = (address, zonecode) => {
    setFormData((prevState) => ({
      ...prevState,
      userAddress: address,
      // 우편번호도 저장하고 싶다면 아래 줄 주석 해제
      // userZonecode: zonecode,
    }));
  };

  const handleUserIdCheck = async () => {
    if (!formData.userId || formData.userId.trim() == "") {
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
    console.log("유저아이디" + formData.userId);
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

  // 컴포넌트 마운트 시 초기값 설정
  useEffect(() => {
    if (formData.userPhoneNum) {
      setFormattedPhone(formatPhoneNumber(formData.userPhoneNum));
    }
  }, []);

  return (
    <div>
      {error && (
        <div className="text-red-500 text-sm mb-1 text-center">{error}</div>
      )}

      <UserIdInput
        userId={formData.userId}
        onChange={handleChange}
        onCheck={handleUserIdCheck}
      />

      <PasswordInput
        password={formData.userPw}
        confirmPassword={formData.confirmPassword}
        showPassword={showPassword}
        showConfirmPassword={showConfirmPassword}
        passwordValid={passwordValid}
        passwordMatch={passwordMatch}
        onChange={handleChange}
        togglePasswordVisibility={togglePasswordVisibility}
        toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility}
      />

      <ProfileInputs
        formData={formData}
        onChange={handleChange}
        onAddressSearchClick={() => setIsAddressModalOpen(true)}
      />

      <EmailInput
        userEmailId={formData.userEmailId}
        userEmailDomain={formData.userEmailDomain}
        userEmail={formData.userEmail}
        customDomainInput={customDomainInput}
        setCustomDomainInput={setCustomDomainInput}
        onChange={handleChange}
      />

      <PhoneInput
        formattedPhone={formattedPhone}
        phoneError={phoneError}
        onChange={handleChange}
      />

      <AgreementSection
        formData={formData}
        onChange={handleChange}
        handleCheckAll={handleCheckAll}
      />

      {/* AddressSearch 컴포넌트 추가 */}
      <AddressSearch
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onAddressSelect={handleAddressSelect}
      />

      <SignupButton
        type="submit"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        가입완료
      </SignupButton>
    </div>
  );
};

export default SignUpComponent;
