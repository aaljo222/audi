import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, checkId } from "../../api/memberApi";
import styled from "styled-components";
import {
  formatPhoneNumber,
  validatePhoneNumber,
  passwordRegex,
} from "../signup/utils";

// Import individual components or redefine them with styled-components
import AddressSearch from "../customModal/AddressSearch";

// Styled Components for SignupComponent (matching LoginComponent styling)
const InputGroup = styled.div`
  position: relative;
  width: 90%;
  margin: 0.9rem 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 2rem;
  font-size: 0.9rem;
  background-color: var(--gray);
  border-radius: 0.4rem;
  border: 0.1rem solid var(--white);
  outline: none;
  margin-left: 1.2rem;

  &:focus {
    border: 0.1rem solid var(--primary-color);
  }
`;

const Icon = styled.i`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  font-size: 1.4rem;
  color: var(--gray-2);
`;

const Button = styled.button`
  cursor: pointer;
  width: 90%;
  padding: 0.5rem 0;
  border-radius: 0.5rem;
  border: none;
  background-color: var(--primary-color);
  color: var(--white);
  font-size: 1.2rem;
  outline: none;
  margin-top: 1rem;
`;

const CheckButton = styled.button`
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  background-color: var(--primary-color);
  color: var(--white);
  font-size: 0.8rem;
  outline: none;
  margin-left: 0.5rem;
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  margin-left: 1.2rem;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
  padding-left: 1.2rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  cursor: pointer;

  input {
    margin-right: 0.5rem;
  }
`;

const AddressWrapper = styled.div`
  display: flex;
  width: 90%;
  margin-left: 1.2rem;
`;

const AddressButton = styled.button`
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  background-color: var(--primary-color);
  color: var(--white);
  font-size: 0.8rem;
  outline: none;
  margin-left: 0.5rem;
`;

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
    <div>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {/* User ID Input */}
      <InputGroup>
        <Icon className="bx bxs-user" />
        <Input
          type="text"
          name="userId"
          placeholder="아이디를 입력해주세요."
          value={formData.userId}
          onChange={handleChange}
          style={{ paddingLeft: "1rem" }}
        />
        <CheckButton type="button" onClick={handleUserIdCheck}>
          중복확인
        </CheckButton>
      </InputGroup>

      {/* Password Input */}
      <InputGroup>
        <Icon className="bx bxs-lock-alt" />
        <Input
          type={showPassword ? "text" : "password"}
          name="userPw"
          placeholder="비밀번호를 입력해주세요."
          value={formData.userPw}
          onChange={handleChange}
          style={{ paddingLeft: "1rem" }}
        />
        <span
          style={{
            position: "absolute",
            right: "-8px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
          }}
          onClick={togglePasswordVisibility}
        >
          <img
            src={showPassword ? "/images/showPw.png" : "/images/hidePw.png"}
            alt="아이콘"
            width="24"
            height="24"
          />
        </span>
      </InputGroup>
      {!passwordValid && formData.userPw && (
        <ErrorMessage>
          비밀번호는 6글자 이상, 영어, 숫자, 특수문자가 포함되어야 합니다.
        </ErrorMessage>
      )}

      {/* Confirm Password Input */}
      <InputGroup>
        <Icon className="bx bxs-lock-alt" />
        <Input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="비밀번호를 다시 입력해주세요."
          value={formData.confirmPassword}
          onChange={handleChange}
          style={{ paddingLeft: "1rem" }}
        />
        <span
          style={{
            position: "absolute",
            right: "-8px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
          }}
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
      </InputGroup>
      {!passwordMatch && formData.confirmPassword && (
        <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>
      )}

      {/* Name Input */}
      <InputGroup>
        <Icon className="bx bxs-user" />
        <Input
          type="text"
          name="userName"
          placeholder="이름을 입력해주세요."
          value={formData.userName}
          onChange={handleChange}
          style={{ paddingLeft: "1rem" }}
        />
      </InputGroup>

      {/* Address Input */}
      <InputGroup>
        <Icon className="bx bxs-home" />
        <Input
          type="text"
          name="userAddress"
          placeholder="주소를 입력해주세요."
          value={formData.userAddress}
          onChange={handleChange}
          readOnly
          style={{ paddingLeft: "1rem" }}
        />
        <AddressButton
          type="button"
          onClick={() => setIsAddressModalOpen(true)}
        >
          주소검색
        </AddressButton>
      </InputGroup>

      {/* Email Input */}
      <InputGroup>
        <Icon className="bx bxs-envelope" />
        <div style={{ display: "flex", width: "100%", marginLeft: "1.2rem" }}>
          <Input
            type="text"
            name="userEmailId"
            placeholder="이메일"
            value={formData.userEmailId}
            onChange={handleChange}
            style={{ width: "45%", margin: "0" }}
          />
          <span style={{ margin: "0 5px", alignSelf: "center" }}>@</span>
          {customDomainInput ? (
            <Input
              type="text"
              name="userEmailDomain"
              placeholder="도메인"
              value={formData.userEmailDomain}
              onChange={handleChange}
              style={{ width: "45%", margin: "0" }}
            />
          ) : (
            <select
              name="userEmailDomain"
              value={formData.userEmailDomain}
              onChange={handleChange}
              style={{
                width: "45%",
                padding: "0.8rem",
                borderRadius: "0.4rem",
                border: "0.1rem solid var(--white)",
                backgroundColor: "var(--gray)",
                outline: "none",
              }}
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
      </InputGroup>

      {/* Phone Input */}
      <InputGroup>
        <Icon className="bx bxs-phone" />
        <Input
          type="tel"
          name="userPhoneNum"
          placeholder="휴대폰 번호를 입력해주세요."
          value={formattedPhone}
          onChange={handleChange}
          style={{ paddingLeft: "1rem" }}
        />
      </InputGroup>
      {phoneError && <ErrorMessage>{phoneError}</ErrorMessage>}

      {/* Agreement Section */}
      <div style={{ width: "90%", margin: "1rem auto" }}>
        <CheckboxGroup>
          <CheckboxLabel>
            <input
              type="checkbox"
              checked={
                formData.agreeAge &&
                formData.agreeTerms &&
                formData.agreePrivacy &&
                formData.agreeComercial
              }
              onChange={handleCheckAll}
            />
            전체 동의
          </CheckboxLabel>
        </CheckboxGroup>

        <CheckboxGroup>
          <CheckboxLabel>
            <input
              type="checkbox"
              name="agreeAge"
              checked={formData.agreeAge}
              onChange={handleChange}
            />
            <span>
              만 14세 이상입니다 <span style={{ color: "red" }}>(필수)</span>
            </span>
          </CheckboxLabel>
        </CheckboxGroup>

        <CheckboxGroup>
          <CheckboxLabel>
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
            />
            <span>
              이용약관 <span style={{ color: "red" }}>(필수)</span>
            </span>
          </CheckboxLabel>
        </CheckboxGroup>

        <CheckboxGroup>
          <CheckboxLabel>
            <input
              type="checkbox"
              name="agreePrivacy"
              checked={formData.agreePrivacy}
              onChange={handleChange}
            />
            <span>
              개인정보 수집/이용 <span style={{ color: "red" }}>(필수)</span>
            </span>
          </CheckboxLabel>
        </CheckboxGroup>

        <CheckboxGroup>
          <CheckboxLabel>
            <input
              type="checkbox"
              name="agreeComercial"
              checked={formData.agreeComercial}
              onChange={handleChange}
            />
            <span>마케팅 정보 수신 동의 (선택)</span>
          </CheckboxLabel>
        </CheckboxGroup>
      </div>

      {/* Address Search Modal */}
      <AddressSearch
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onAddressSelect={handleAddressSelect}
      />

      <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
        가입완료
      </Button>
    </div>
  );
};

export default SignUpComponent;
