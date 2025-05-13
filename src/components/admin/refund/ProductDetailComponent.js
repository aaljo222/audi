import React, { useEffect, useState } from "react";
import {
  approveProductRefund,
  getProductRefundDetail,
  rejectProductRefund,
} from "../../../api/adminApi";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetailComponent = () => {
  const { refundId } = useParams();
  const navigate = useNavigate();
  const [refundDetail, setRefundDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProductRefundDetail(refundId);
        setRefundDetail(data);
        console.log("받아온데이타", data);
      } catch (error) {
        console.error("환불 정보 로딩 중 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refundId]);

  const handleApprove = () => {
    if (window.confirm("환불을 승인하시겠습니까?")) {
      setProcessing(true);
      approveProductRefund(refundId, extractPriceNumber(calculateTotalRefund()))
        .then((i) => {
          alert(i);
          navigate("/admin/refund/product/list");
        })
        .catch((err) => {
          alert(err.response.data);
        });
      setProcessing(false);
    }
  };

  const handleReject = () => {
    const rejectReason = window.prompt("환불 거절 사유를 입력해주세요:");
    if (rejectReason) {
      setProcessing(true);
      rejectProductRefund(refundId, rejectReason)
        .then((i) => {
          alert(i);
          navigate("/admin/refund/product/list");
        })
        .catch((err) => {
          alert(err.response.data);
        });
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일 ${date.getHours()}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "WAITING":
        return (
          <span className="px-3 py-1.5 text-sm font-medium rounded bg-blue-100 text-blue-800">
            대기중
          </span>
        );
      case "COMPLETE":
        return (
          <span className="px-3 py-1.5 text-sm font-medium rounded bg-green-100 text-green-800">
            완료
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-3 py-1.5 text-sm font-medium rounded bg-red-100 text-red-800">
            거절
          </span>
        );
      default:
        return (
          <span className="px-3 py-1.5 text-sm font-medium rounded bg-gray-100 text-gray-800">
            알 수 없음
          </span>
        );
    }
  };

  // 가격 문자열에서 숫자만 추출
  const extractPriceNumber = (priceString) => {
    if (!priceString) return 0;
    const matches = priceString.match(/\d+/g);
    return matches ? parseInt(matches.join("")) : 0;
  };

  // 총 환불 금액 계산
  const calculateTotalRefund = () => {
    const priceValue = extractPriceNumber(refundDetail.price);
    const quantity = refundDetail.numOfItem || 0;
    return (priceValue * quantity).toLocaleString() + "원";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    // 콘텐츠를 중앙에 배치하기 위해 max-w-4xl과 mx-auto 클래스 적용
    <div className="bg-white rounded shadow max-w-6xl mx-auto my-16">
      {/* 헤더 */}
      <div className="border-b border-gray-200 p-12 flex justify-between items-center bg-gray-50 rounded-t">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            환불 요청 #{refundDetail.refundId}
          </h1>
          <p className="text-md text-gray-500 mt-1">
            구매 일자 : {formatDate(refundDetail.orderDate)}
          </p>
        </div>
        <div>{getStatusBadge(refundDetail.status)}</div>
      </div>

      <div className="p-6">
        {/* 제품 및 고객 정보 - 이미지 부분 가로폭 줄이고, 고객정보 부분 확장 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6 mt-6">
          {/* 제품 이미지 - 가로폭 줄임(1/5) */}
          <div className="md:col-span-1">
            <div className="border border-gray-200 rounded  flex items-center justify-center  bg-gray-50">
              <img
                src={
                  refundDetail.productImgFileName
                    ? `http://localhost:8089/product/view/${refundDetail.productImgFileName}`
                    : "/images/defalt.png"
                }
                alt={refundDetail.pname}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          {/* 제품 정보 */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 border-l-4 border-orange-500 pl-3">
              제품 정보
            </h2>
            <table className="w-full text-md">
              <tbody>
                <tr>
                  <td className="py-2 text-gray-900 font-semibold">제품명</td>
                  <td className="py-2 text-right font-medium">
                    {refundDetail.pname || "-"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-900 font-semibold">가격</td>
                  <td className="py-2 text-right font-medium">
                    {refundDetail.price || "-"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-900 font-semibold">수량</td>
                  <td className="py-2 text-right font-medium">
                    {refundDetail.numOfItem || "-"}
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="py-3 text-gray-900 font-bold text-lg">
                    총 환불금액
                  </td>
                  <td className="py-3 text-right font-bold text-orange-500 text-lg">
                    {calculateTotalRefund()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 고객 정보 - 가로폭 확장(2/5) */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 border-l-4 border-orange-500 pl-3">
              고객 정보
            </h2>
            <table className="w-full text-md">
              <tbody>
                <tr>
                  <td className="py-2 text-gray-900 font-semibold">고객 ID</td>
                  <td className="py-2 text-right">
                    {refundDetail.userId || "-"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-900 font-semibold">고객명</td>
                  <td className="py-2 text-right">
                    {refundDetail.userName || "-"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-900 font-semibold">연락처</td>
                  <td className="py-2 text-right">
                    {refundDetail.userPhoneNum || "-"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-900 font-semibold">배송지</td>
                  <td className="py-2 text-right break-words">
                    {refundDetail.userAddress || "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 환불 정보 */}
        <div className="border border-gray-200 rounded p-6 mb-12 mt-12">
          <h2 className="text-lg font-semibold mb-4 border-l-4 border-orange-500 pl-3">
            환불 정보
          </h2>
          <div>
            <span className="text-md text-gray-900 font-semibold block mb-2">
              환불 사유
            </span>
            <div className="p-4 bg-gray-50 rounded border border-gray-200 min-h-16 text-md">
              {refundDetail.reason || "사유가 입력되지 않았습니다."}
            </div>
          </div>
        </div>

        {/* 버튼 영역 - 마지막 요소로 하단 여백 제거 */}
        {refundDetail.status === "WAITING" && (
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => navigate("/admin/refund/product/list")}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-md font-medium"
              disabled={processing}
            >
              목록
            </button>
            <button
              onClick={handleReject}
              className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-md font-medium"
              disabled={processing}
            >
              {processing ? "처리 중..." : "거절하기"}
            </button>
            <button
              onClick={handleApprove}
              className="px-6 py-3 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-md font-medium"
              disabled={processing}
            >
              {processing ? "처리 중..." : "승인하기"}
            </button>
          </div>
        )}

        {refundDetail.status !== "WAITING" && (
          <div className="flex justify-end">
            <button
              onClick={() => navigate("/admin/refund/product/list")}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-md font-medium"
            >
              목록으로
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailComponent;
