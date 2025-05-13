import React, { useState } from "react";
import { InputGroup, Input, Icon, ErrorMessage } from "../signup/styles";

const PhoneInput = ({ formattedPhone, phoneError, onChange }) => {
  // 입력 필드에 포커스 여부를 추적하는 상태 추가
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <InputGroup>
        <Icon className="bx bxs-phone" />
        <Input
          type="text"
          name="userPhoneNum"
          // 포커스 상태에 따라 값 또는 placeholder 표시
          value={isFocused || formattedPhone !== "010" ? formattedPhone : ""}
          onChange={onChange}
          style={{ paddingLeft: "1rem" }}
          // placeholder 추가 - 포커스가 없을 때만 표시
          placeholder={!isFocused ? "휴대폰 번호를 입력해주세요(-제외)" : ""}
          // 포커스 이벤트 핸들러 추가
          onFocus={() => setIsFocused(true)}
          // 포커스가 사라질 때 처리
          onBlur={() => {
            setIsFocused(false);
            // 입력값이 없을 때 기본값 '010'으로 설정되어 있는지 확인
          }}
        />
      </InputGroup>
      <div className="text-start">
        {formattedPhone && <ErrorMessage>{phoneError}</ErrorMessage>}
      </div>
    </>
  );
};

export default PhoneInput;