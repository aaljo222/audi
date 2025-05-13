import React from "react";
import { InputGroup, Input, Icon, ErrorMessage } from "../signup/styles";

const PasswordInput = ({ 
  password, 
  confirmPassword, 
  showPassword, 
  showConfirmPassword,
  passwordValid,
  passwordMatch,
  onChange,
  togglePasswordVisibility,
  toggleConfirmPasswordVisibility
}) => {
  return (
    <>
      <InputGroup>
        <Icon className="bx bxs-lock-alt" />
        <Input
          type={showPassword ? "text" : "password"}
          name="userPw"
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={onChange}
          style={{ paddingLeft: "1rem" }}
        />
        <span
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
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
      {!passwordValid && password && (
        <div className="text-xs text-red-600 mb-2 text-start pl-1">
          영문, 특수문자, 숫자를 모두 포함해야 하며 6글자 이상입니다.
        </div>
      )}

      <InputGroup>
        <Icon className="bx bxs-lock-alt" />
        <Input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="비밀번호를 재입력해주세요"
          value={confirmPassword}
          onChange={onChange}
          style={{ paddingLeft: "1rem" }}
        />
        <span
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
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
      {confirmPassword && (
        <div
          className={`text-xs mb-2 text-start pl-1 ${
            passwordMatch ? "text-green-600" : "text-red-600"
          }`}
        >
          {passwordMatch
            ? "비밀번호가 일치합니다."
            : "비밀번호가 일치하지 않습니다."}
        </div>
      )}
    </>
  );
};

export default PasswordInput;