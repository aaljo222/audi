import React from "react";
import { InputGroup, Input, Icon } from "../signup/styles";

const EmailInput = ({ 
  userEmailId, 
  userEmailDomain, 
  userEmail,
  customDomainInput, 
  setCustomDomainInput, 
  onChange 
}) => {
  return (
    <InputGroup>
      <Icon className="bx bxs-envelope" />
      <div className="flex w-full items-center">
        <Input
          type="text"
          name="userEmailId"
          placeholder="이메일 아이디"
          value={userEmailId}
          onChange={onChange}
          style={{
            paddingLeft: "1rem",
            width: "35%",
            marginRight: "0",
          }}
        />
        <span>@</span>

        {customDomainInput ? (
          <Input
            type="text"
            name="userEmailDomain"
            placeholder="도메인 입력"
            value={userEmailDomain}
            onChange={(e) =>
              onChange({
                target: { name: "userEmailDomain", value: e.target.value },
              })
            }
            style={{
              paddingLeft: "1rem",
              width: "35%",
            }}
          />
        ) : (
          <Input
            type="text"
            name="userEmailDomain"
            placeholder="도메인 선택"
            value={userEmailDomain}
            readOnly
            style={{
              paddingLeft: "1rem",
              width: "35%",
            }}
          />
        )}

        <div className="ml-2" style={{ width: "30%" }}>
          <select
            name="userEmailDomain"
            value={customDomainInput ? "custom" : userEmailDomain}
            onChange={(e) => {
              if (e.target.value === "custom") {
                setCustomDomainInput(true);
                onChange({
                  target: { name: "userEmailDomain", value: "" },
                });
              } else {
                setCustomDomainInput(false);
                onChange(e);
              }
            }}
            className="w-full border rounded-md p-2.5 bg-gray-100"
          >
            <option value="">선택</option>
            <option value="naver.com">naver.com</option>
            <option value="gmail.com">gmail.com</option>
            <option value="daum.net">daum.net</option>
            <option value="custom">직접 입력</option>
          </select>
        </div>
      </div>
      
      <Input
        type="email"
        name="userEmail"
        value={userEmail}
        readOnly
        style={{ display: "none" }}
      />
    </InputGroup>
  );
};

export default EmailInput;