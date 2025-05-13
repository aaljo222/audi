import React from "react";

const AgreementSection = ({ formData, onChange, handleCheckAll }) => {
  return (
    <div className="my-3">
      <label className="flex items-center mb-2 ml-1">
        <input
          type="checkbox"
          name="agreeAll"
          checked={
            formData.agreeAge &&
            formData.agreeTerms &&
            formData.agreePrivacy &&
            formData.agreeComercial
          }
          onChange={handleCheckAll}
          className="mr-2"
        />
        <span className="text-sm">전체 동의</span>
      </label>

      <div className="flex flex-wrap ml-1">
        <label className="flex items-center w-full sm:w-1/2 mb-1">
          <input
            type="checkbox"
            name="agreeAge"
            checked={formData.agreeAge}
            onChange={onChange}
            className="mr-2"
          />
          <span className="text-sm">[필수] 만 14세 이상입니다</span>
        </label>

        <label className="flex items-center w-full sm:w-1/2 mb-1">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={onChange}
            className="mr-2"
          />
          <span className="text-sm">[필수] 이용약관 동의</span>
        </label>
      </div>

      <div className="flex flex-wrap ml-1">
        <label className="flex items-center w-full sm:w-1/2 mb-1">
          <input
            type="checkbox"
            name="agreePrivacy"
            checked={formData.agreePrivacy}
            onChange={onChange}
            className="mr-2"
          />
          <span className="text-sm">[필수] 개인정보 수집 동의</span>
        </label>

        <label className="flex items-center w-full sm:w-1/2 mb-1">
          <input
            type="checkbox"
            name="agreeComercial"
            checked={formData.agreeComercial}
            onChange={onChange}
            className="mr-2"
          />
          <span className="text-sm">[선택] 광고성 정보 수신 동의</span>
        </label>
      </div>
    </div>
  );
};

export default AgreementSection;