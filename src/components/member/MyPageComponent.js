import React, { useState, useEffect } from "react";
import MyPageModify from "../../components/mypage/MyPageModify";
import MyPageOrders from "../../components/mypage/MyPageOrders";
import MyPageReview from "../../components/mypage/MyPageReview";
import DeleteAccount from "../../components/mypage/MyPageDelete";
import MyPageReservation from "../../components/mypage/MyPageReservation";
import MyPagePoint from "../../components/mypage/MyPagePoint";

import {
  getProfile,
  ordersResponse,
  productReview,
  getReservation,
  getPointList,
} from "../../api/memberApi";

const MyPageComponent = ({ userId, data }) => {
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [points, setPoints] = useState([]);
  const [totalPoint, setTotalPoint] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [reservation, setReservation] = useState([]);

  const loginUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getProfile(userId)
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => {
        console.log("사용자정보불러오기 에러");
      });
    ordersResponse(loginUser.uid)
      .then((data) => {
        setOrders(data);
      })
      .catch((error) => {
        console.log("주문내역불러오기 에러");
      });

    getReservation(loginUser.uid)
      .then((data) => {
        setReservation(data);
      })
      .catch((error) => {
        console.log("예약내역 불러오기 에러!!");
      });

    getPointList(loginUser.uid)
      .then((data) => {
        setPoints(data);
        const total = data.reduce((acc, point) => acc + point.pointAmount, 0);
        setTotalPoint(total);
      })
      .catch((error) => {
        console.log("포인트 내역 불러오기 에러!!");
      });

    productReview(loginUser.uid)
      .then((data) => {
        setReviews(data || []);
      })
      .catch((error) => {
        console.log("리뷰불러오기 에러");
      });
  }, [userId, refreshTrigger]);

  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1); // 값만 변경하면 useEffect가 다시 실행됨
  };

  // 각 섹션별 렌더링
  switch (data) {
    case "settings":
      return (
        <MyPageModify
          userData={userData}
          refreshData={refreshData}
          userId={userId}
        />
      );
    case "orders":
      return (
        <MyPageOrders
          orders={orders}
          refreshData={refreshData}
          uid={loginUser.uid}
        />
      );

    case "reservation":
      return (
        <MyPageReservation
          reservation={reservation}
          refreshData={refreshData}
          uid={loginUser.uid}
        />
      );

    case "point":
      return <MyPagePoint points={points} totalPoint={totalPoint} />;

    case "reviews":
      return <MyPageReview reviews={reviews} refreshData={refreshData} />;
    case "deleteMember":
      return <DeleteAccount userId={userId} />;
    default:
      return <div>선택된 섹션이 없습니다.</div>;
  }
};

export default MyPageComponent;
