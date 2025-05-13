import React, { useEffect, useState } from "react";
import { getProductRefundList } from "../../../api/adminApi";
import { useNavigate } from "react-router-dom";

const ProductRefundListComponent = () => {
  const [refundList, setRefundList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [statusFilter, setStatusFilter] = useState("전체");
  const [refresh, setRefresh] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    getProductRefundList().then((data) => {
      setRefundList(data);
      setFilteredList(data); // 기본적으로 전체 데이터를 필터된 데이터로 설정
      console.log(data);
    });
  }, [refresh]);

  useEffect(() => {
    // 상태 필터링
    if (statusFilter === "전체") {
      setFilteredList(refundList); // "전체"일 경우 모든 데이터 표시
    } else {
      setFilteredList(
        refundList.filter((refund) => refund.status === statusFilter)
      );
    }
  }, [statusFilter, refundList]);

  const handleDetail = (refundId) => {
    navigate(`/admin/refund/product/${refundId}`);
  };

  // 환불 상태에 따른 배지 색상 반환 함수
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "WAITING":
        return "bg-yellow-200 text-yellow-700";
      case "COMPLETE":
        return "bg-blue-200 text-blue-700";
      case "REJECTED":
        return "bg-red-200 text-red-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  // 환불 상태 한글 변환 함수
  const getStatusInKorean = (status) => {
    switch (status) {
      case "WAITING":
        return "대기중";
      case "COMPLETE":
        return "완료됨";
      case "REJECTED":
        return "거절됨";
      default:
        return status;
    }
  };

  return (
    <div className="w-full bg-white p-4 rounded shadow">
      <h1 className="text-xl font-bold mb-4">환불 관리</h1>

      {/* 상태 필터 */}
      <div className="mb-4">
        <select
          className="px-4 py-2 border rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="전체">전체</option>
          <option value="WAITING">대기중</option>
          <option value="COMPLETE">완료됨</option>
          <option value="REJECTED">거절됨</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">환불 번호</th>
              <th className="py-2 px-4 text-left">주문 번호</th>
              <th className="py-2 px-4 text-left">사용자 ID</th>
              <th className="py-2 px-4 text-left">상태</th>
              <th className="py-2 px-4 text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((refund, index) => (
              <tr
                key={refund.refundId || index}
                className="border-b hover:bg-gray-50"
              >
                <td className="py-2 px-4">{refund.refundId}</td>
                <td className="py-2 px-4">{refund.orderNum}</td>
                <td className="py-2 px-4">{refund.userId}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(
                      refund.status
                    )}`}
                  >
                    {getStatusInKorean(refund.status)}
                  </span>
                </td>
                <td className="py-2 px-4">
                  <div className="flex justify-center items-center h-full space-x-2">
                    <button
                      onClick={() => handleDetail(refund.refundId)}
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

      {filteredList.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          환불 요청이 없습니다
        </div>
      )}
    </div>
  );
};

export default ProductRefundListComponent;
