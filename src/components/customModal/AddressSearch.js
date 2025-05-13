import React from "react";
import DaumPostcode from "react-daum-postcode";

function AddressSearch({ isOpen, onClose, onAddressSelect }) {
  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    console.log(fullAddress); // 전체 주소
    console.log(data.zonecode); // 우편번호

    onAddressSelect(fullAddress, data.zonecode);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "1rem",
          borderRadius: "0.5rem",
          width: "100%",
          maxWidth: "600px",
          maxHeight: "80vh",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
          }}
        >
          <h3 style={{ fontWeight: "bold", fontSize: "1.125rem" }}>
            주소 찾기
          </h3>
          <button onClick={onClose} style={{ color: "#6b7280" }}>
            닫기
          </button>
        </div>
        <DaumPostcode
          onComplete={handleComplete}
          style={{ height: "450px", width: "100%" }}
          autoClose={false}
        />
      </div>
    </div>
  );
}

export default AddressSearch;
