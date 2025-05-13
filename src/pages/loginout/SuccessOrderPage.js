import React from "react";
import SuccessOrderComponent from "../../components/member/SuccessOrderComponent";
import MainMenubar from "../../components/menu/MainMenubar";

const LoginPage = () => {
  return (
    <div className="fixed top-0 left-0 z-[1055] flex flex-col h-full w-full bg-gray-100">
      <MainMenubar />
      <div className="flex flex-wrap w-full h-full justify-center items-center border-2">
        <SuccessOrderComponent />
      </div>
    </div>
  );
};

export default LoginPage;
