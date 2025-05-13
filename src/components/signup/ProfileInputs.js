import React from "react";
import { InputGroup, Input, Icon, IdCheckButton } from "../signup/styles";

const ProfileInputs = ({ formData, onChange, onAddressSearchClick }) => {
  return (
    <div className="mb-3">
      <div className="mb-2">
        <InputGroup>
          <Icon className="bx bxs-user" />
          <Input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={onChange}
            placeholder="이름을 입력해주세요"
            style={{ paddingLeft: "1rem" }}
          />
        </InputGroup>
      </div>

      <InputGroup style={{ display: "flex", alignItems: "center" }}>
        <Icon className="bx bxs-map" />
        <Input
          type="text"
          name="userAddress"
          value={formData.userAddress}
          onChange={onChange}
          placeholder="주소를 검색해주세요"
          style={{
            paddingLeft: "1rem",
            flex: 8,
          }}
          readOnly
        />
        <IdCheckButton
          type="button"
          onClick={onAddressSearchClick}
          style={{
            marginLeft: "1rem",
            flex: 2,
          }}
        >
          주소 찾기
        </IdCheckButton>
      </InputGroup>
    </div>
  );
};

export default ProfileInputs;
