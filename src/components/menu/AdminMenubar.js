import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Home,
  Music,
  Ticket,
  ShoppingBag,
  Users,
  Settings,
  ChevronsRight,
} from "lucide-react";

const AdminMenubar = () => {
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState(window.location.pathname);

  // Navigation function that updates the active path
  const handleNavigation = (path) => {
    setActivePath(path);
    navigate(path);
  };

  return (
    <aside className="w-64 bg-white shadow-md p-4 flex flex-col flex-shrink-0">
      <div
        className="flex items-center justify-center   mb-8 cursor-pointer"
        onClick={() => handleNavigation("/")}
      >
        <div className="w-28 h-28 bg-white-100 rounded-md mr-3 flex items-center  justify-center">
          <img
            src={`${process.env.PUBLIC_URL}/images/mainlogo.png`}
            alt="AudiMew Logo"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <nav className="flex-grow">
        <ul className="space-y-1">
          <li className="group">
            <div
              className={`flex items-center p-3 rounded-lg hover:bg-blue-100 transition-all cursor-pointer ${
                activePath === "/admin" ? "bg-blue-100" : ""
              }`}
              onClick={() => handleNavigation("/admin")}
            >
              <Settings className="w-5 h-5 mr-3" />
              <span>판매 통계 분석</span>
              <ChevronsRight
                className={`w-4 h-4 ml-auto ${
                  activePath === "/admin"
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                } transition-opacity`}
              />
            </div>
          </li>

          <li className="mt-5">
            <p className="text-gray-400 text-xs uppercase font-semibold px-3 mb-2">
              음향 상품
            </p>
            <ul className="space-y-1">
              <li className="group">
                <div
                  className={`flex items-center p-3 rounded-lg hover:bg-blue-100 transition-all cursor-pointer ${
                    activePath === "/admin/products/add" ? "bg-blue-100" : ""
                  }`}
                  onClick={() => handleNavigation("/admin/products/add")}
                >
                  <Music className="w-5 h-5 mr-3" />
                  <span>음향 상품 등록</span>
                  <ChevronsRight
                    className={`w-4 h-4 ml-auto ${
                      activePath === "/admin/products/add"
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    } transition-opacity`}
                  />
                </div>
              </li>
              <li className="group">
                <div
                  className={`flex items-center p-3 rounded-lg hover:bg-blue-100 transition-all cursor-pointer ${
                    activePath === "/admin/products/list" ? "bg-blue-100" : ""
                  }`}
                  onClick={() => handleNavigation("/admin/products/list")}
                >
                  <Music className="w-5 h-5 mr-3" />
                  <span>음향 상품 관리</span>
                  <ChevronsRight
                    className={`w-4 h-4 ml-auto ${
                      activePath === "/admin/products/list"
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    } transition-opacity`}
                  />
                </div>
              </li>
              <li className="group">
                <div
                  className={`flex items-center p-3 rounded-lg hover:bg-blue-100 transition-all cursor-pointer ${
                    activePath === "/admin/products/order/list"
                      ? "bg-blue-100"
                      : ""
                  }`}
                  onClick={() => handleNavigation("/admin/products/order/list")}
                >
                  <Music className="w-5 h-5 mr-3" />
                  <span>상품 주문 관리</span>
                  <ChevronsRight
                    className={`w-4 h-4 ml-auto ${
                      activePath === "/admin/products/order/list"
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    } transition-opacity`}
                  />
                </div>
              </li>
            </ul>
          </li>

          <li className="mt-5">
            <p className="text-gray-400 text-xs uppercase font-semibold px-3 mb-2">
              공연 티켓
            </p>
            <ul className="space-y-1">
              <li className="group">
                <div
                  className={`flex items-center p-3 rounded-lg hover:bg-blue-100 transition-all cursor-pointer ${
                    activePath === "/admin/concert/add" ? "bg-blue-100" : ""
                  }`}
                  onClick={() => handleNavigation("/admin/concert/add")}
                >
                  <Ticket className="w-5 h-5 mr-3" />
                  <span>공연 티켓 등록</span>
                  <ChevronsRight
                    className={`w-4 h-4 ml-auto ${
                      activePath === "/admin/concert/add"
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    } transition-opacity`}
                  />
                </div>
              </li>
              <li className="group">
                <div
                  className={`flex items-center p-3 rounded-lg hover:bg-blue-100 transition-all cursor-pointer ${
                    activePath === "/admin/concert/list" ? "bg-blue-100" : ""
                  }`}
                  onClick={() => handleNavigation("/admin/concert/list")}
                >
                  <Ticket className="w-5 h-5 mr-3" />
                  <span>공연 티켓 관리</span>
                  <ChevronsRight
                    className={`w-4 h-4 ml-auto ${
                      activePath === "/admin/concert/list"
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    } transition-opacity`}
                  />
                </div>
              </li>
              <li className="group">
                <div
                  className={`flex items-center p-3 rounded-lg hover:bg-blue-100 transition-all cursor-pointer ${
                    activePath === "/admin/concert/order/list"
                      ? "bg-blue-100"
                      : ""
                  }`}
                  onClick={() => handleNavigation("/admin/concert/order/list")}
                >
                  <Ticket className="w-5 h-5 mr-3" />
                  <span>티켓 주문 관리</span>
                  <ChevronsRight
                    className={`w-4 h-4 ml-auto ${
                      activePath === "/admin/concert/order/list"
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    } transition-opacity`}
                  />
                </div>
              </li>
            </ul>
          </li>

          <li className="mt-5">
            <p className="text-gray-400 text-xs uppercase font-semibold px-3 mb-2">
              유저 관리
            </p>
            <ul className="space-y-1">
              <li className="group">
                <div
                  className={`flex items-center p-3 rounded-lg hover:bg-blue-100 transition-all cursor-pointer ${
                    activePath === "/admin/user" ? "bg-blue-100" : ""
                  }`}
                  onClick={() => handleNavigation("/admin/user")}
                >
                  <Users className="w-5 h-5 mr-3" />
                  <span>가입 유저 목록</span>
                  <ChevronsRight
                    className={`w-4 h-4 ml-auto ${
                      activePath === "/admin/user"
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    } transition-opacity`}
                  />
                </div>
              </li>
              <li className="group">
                <div
                  className={`flex items-center p-3 rounded-lg hover:bg-blue-100 transition-all cursor-pointer ${
                    activePath === "/admin/refund/product/list"
                      ? "bg-blue-100"
                      : ""
                  }`}
                  onClick={() => handleNavigation("/admin/refund/product/list")}
                >
                  <Users className="w-5 h-5 mr-3" />
                  <span>상품 환불 요청 관리</span>
                  <ChevronsRight
                    className={`w-4 h-4 ml-auto ${
                      activePath === "/admin/refund/product/list"
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    } transition-opacity`}
                  />
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminMenubar;
