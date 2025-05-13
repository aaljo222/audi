import React, { useEffect, useState } from "react";
import { getProductOrderList } from "../../../api/adminApi";
import { useNavigate } from "react-router-dom";

const ProductOrderComponent = () => {
  const [orderList, setOrderList] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("전체");
  const navigate = useNavigate();

  useEffect(() => {
    getProductOrderList().then((data) => {
      setOrderList(data);
      setFilteredOrders(data);
      console.log(data);
    });
  }, []);

  useEffect(() => {
    // 상태 필터링
    if (statusFilter === "전체") {
      setFilteredOrders(orderList); // "전체"일 경우 모든 데이터 표시
    } else {
      setFilteredOrders(
        orderList.filter((order) => order.status === statusFilter)
      );
    }
  }, [statusFilter, orderList]);

  // 주문 상태에 따른 한글 표시
  const getStatusText = (status) => {
    switch (status) {
      case "PAY_COMPLETED":
        return "결제완료";
      case "SHIPPING":
        return "배송중";
      case "DELIVERED":
        return "배송완료";
      default:
        return status;
    }
  };

  // 주문 상태에 따른 색상 클래스
  const getStatusColorClass = (status) => {
    switch (status) {
      case "PAY_COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "SHIPPING":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 날짜 형식 변환 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  // 주문 상세 페이지로 이동
  const handleOrderDetail = (orderNum) => {
    navigate(`/admin/products/order/detail/${orderNum}`);
  };

  return (
    <div className="w-full bg-white p-4 rounded shadow">
      <h1 className="text-xl font-bold mb-4">상품 주문 관리</h1>

      <div className="mb-4">
        <select
          className="px-4 py-2 border rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="전체">전체</option>
          <option value="PAY_COMPLETED">결제완료</option>
          <option value="SHIPPING">배송중</option>
          <option value="DELIVERED">배송완료</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">주문고유번호</th>
              <th className="py-2 px-4 text-left">회원고유번호</th>
              <th className="py-2 px-4 text-left">주문상태</th>
              <th className="py-2 px-4 text-left">주문일시</th>
              <th className="py-2 px-4 text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.orderNum} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{order.orderNum}</td>
                <td className="py-2 px-4">{order.uid}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColorClass(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="py-2 px-4">{formatDate(order.orderDate)}</td>
                <td className="py-2 px-4">
                  <div className="flex justify-center items-center h-full">
                    <button
                      onClick={() => handleOrderDetail(order.orderNum)}
                      className="bg-teal-500 hover:bg-teal-600 text-white py-1 px-3 rounded text-sm"
                    >
                      상세보기
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orderList.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          등록된 주문이 없습니다
        </div>
      )}
    </div>
  );
};

export default ProductOrderComponent;
