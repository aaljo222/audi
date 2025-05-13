import React from "react";
import LoginComponent from "../../components/member/LoginComponent";
import MainMenubar from "../../components/menu/MainMenubar";

const LoginPage = () => {
  return (
    <div className="fixed top-0 left-0 z-[1055] flex flex-col h-full w-full bg-gray-100">
      <MainMenubar currentIndex={3} />
      <div className="flex flex-wrap w-full h-full justify-center items-center border-2">
        <LoginComponent />
      </div>
    </div>
  );
};

export default LoginPage;
