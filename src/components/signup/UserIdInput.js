import React from "react";
import { InputGroup, Input, Icon, IdCheckButton } from "../signup/styles";

const UserIdInput = ({ userId, onChange, onCheck }) => {
  return (
    <InputGroup style={{ display: "flex", alignItems: "center" }}>
      <Icon className="bx bxs-user" />
      <Input
        type="text"
        name="userId"
        placeholder="아이디를 입력해주세요"
        value={userId}
        onChange={onChange}
        style={{
          paddingLeft: "1rem",
          flex: 8,
        }}
      />
      <IdCheckButton
        type="button"
        onClick={onCheck}
        style={{
          marginLeft: "1rem",
          flex: 2,
        }}
      >
        중복 확인
      </IdCheckButton>
    </InputGroup>
  );
};

export default UserIdInput;