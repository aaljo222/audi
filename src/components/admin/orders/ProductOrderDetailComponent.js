import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductOrderDetail,
  modifyProductOrder,
} from "../../../api/adminApi";

const ProductOrderDetailComponent = () => {
  const { orderNum } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState({});
  const [trackingNumber, setTrackingNumber] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    // API 호출 - 주문 상세 정보 가져오기
    // 여기에 getProductOrderDetail API 호출 코드를 작성하세요
    getProductOrderDetail(orderNum)
      .then((data) => {
        setOrderDetails(data);
        setStatus(data.status);
        setTrackingNumber(data.trackingNumber || "");
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [orderNum]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleTrackingNumberChange = (e) => {
    setTrackingNumber(e.target.value);
  };

  const handleSubmit = () => {
    if (status === "SHIPPING" && !trackingNumber) {
      alert("배송 중 상태로 변경하려면 운송장 번호를 입력해야 합니다.");
      return;
    }

    const updateData = {
      status: status,
      orderNum: parseInt(orderNum),
      trackingNumber: trackingNumber,
    };
    console.log("백엔드로 보낼 데이터:", updateData);
    setIsUpdating(true);
    modifyProductOrder(updateData)
      .then((response) => {
        alert(response);
        setIsUpdating(false);
        navigate("/admin/products/order/list");
      })
      .catch((error) => {
        console.error("주문 업데이트 실패:", error);
        alert("주문 정보 업데이트에 실패했습니다.");
        setIsUpdating(false);
      });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PAY_COMPLETED":
        return "결제 완료";
      case "SHIPPING":
        return "배송 중";
      case "DELIVERED":
        return "배송 완료";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PAY_COMPLETED":
        return "bg-amber-100 text-amber-800";
      case "SHIPPING":
        return "bg-blue-100 text-blue-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="w-2/3 mx-auto p-4 font-sans">
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-medium text-gray-800 mb-4 md:mb-0">
          주문 상세 정보
        </h2>
        <button
          onClick={handleGoBack}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded transition-colors w-full md:w-auto"
        >
          목록으로 돌아가기
        </button>
      </div>

      {/* 주문 기본 정보 */}
      <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          주문 기본 정보
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              주문 번호
            </label>
            <span className="text-base font-medium">
              {orderDetails.orderNum}
            </span>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              주문 일자
            </label>
            <span className="text-base">
              {formatDate(orderDetails.orderDate)}
            </span>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              주문 금액
            </label>
            <span className="text-base font-medium">
              {orderDetails.totalPrice}
            </span>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              현재 상태
            </label>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                orderDetails.status
              )}`}
            >
              {getStatusText(orderDetails.status)}
            </span>
          </div>
        </div>
      </div>

      {/* 고객 정보 */}
      <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-100">
          고객 정보
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">고객명</label>
            <span className="text-base">{orderDetails.userDTO?.userName}</span>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">아이디</label>
            <span className="text-base">{orderDetails.userDTO?.userId}</span>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">이메일</label>
            <span className="text-base">{orderDetails.userDTO?.userEmail}</span>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              배송지 주소
            </label>
            <span className="text-base">{orderDetails.shippingAddress}</span>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-500 mb-1">
              배송 요청 사항
            </label>
            <span className="text-base">{orderDetails.note || "-"}</span>
          </div>
        </div>
      </div>

      {/* 주문 상품 목록 */}
      <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-100">
          주문 상품 목록
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  상품 번호
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  상품명
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  수량
                </th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.orderItemDTOList?.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="px-4 py-3 text-sm">{item.pno}</td>
                  <td className="px-4 py-3 text-sm">{item.pname}</td>
                  <td className="px-4 py-3 text-sm">{item.numOfItem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 주문 상태 관리 */}
      <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-100">
          주문 상태 관리
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              운송장 번호
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={handleTrackingNumberChange}
              placeholder="운송장 번호를 입력하세요"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              주문 상태
            </label>
            <select
              value={status}
              onChange={handleStatusChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="PAY_COMPLETED">결제 완료</option>
              <option value="SHIPPING">배송 중</option>
              <option value="DELIVERED">배송 완료</option>
            </select>
          </div>
          <button
            onClick={handleSubmit}
            className={`w-full py-3 rounded text-white font-medium transition-colors ${
              isUpdating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isUpdating}
          >
            {isUpdating ? "처리 중..." : "상태 업데이트"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductOrderDetailComponent;
