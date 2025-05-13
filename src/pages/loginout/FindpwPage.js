import React from "react";
import MainMenubar from "../../components/menu/MainMenubar";
import FindpwComponent from "../../components/member/FindpwComponent";

const FindpwPage = () => {
  return (
    <div className="fixed top-0 left-0 z-[1055] flex flex-col h-full w-full bg-gray-100">
      <MainMenubar />
      <div className="flex flex-wrap w-full h-full justify-center items-center border-2">
        <FindpwComponent />
      </div>
    </div>
  );
};

export default FindpwPage;
