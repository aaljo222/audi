import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

// Admin 권한을 확인하는 ProtectedRoute 컴포넌트
const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  // localStorage에서 유저 정보 가져오기
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  // 유저 권한 확인
  const isAdmin = user && user.userRole === "ADMIN";

  useEffect(() => {
    // 권한이 없는 경우 알림 표시
    if (!isAdmin && isAuthenticated) {
      alert("관리자 권한이 필요합니다.");
    } else if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
    }
  }, [isAdmin, isAuthenticated]);

  // 인증되지 않았거나 Admin이 아닌 경우 메인 페이지로 리다이렉트
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Admin인 경우 자식 컴포넌트 렌더링
  return children;
};

export default ProtectedRoute;
