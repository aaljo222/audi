import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function SalesChart({ salesData }) {
  // 백엔드에서 받은 데이터를 차트 형식에 맞게 변환
  const formatData = () => {
    if (!salesData || salesData.length < 2) return [];

    const ticketData = salesData[0];
    const productData = salesData[1];

    // 1월부터 12월까지의 데이터 포맷팅
    return Array.from({ length: 12 }, (_, i) => {
      const month = (i + 1).toString();

      // 티켓 판매 금액과 개수
      const ticketAmount = ticketData[month] ? ticketData[month][0] : 0;
      const ticketCount = ticketData[month] ? ticketData[month][1] : 0;

      // 상품 판매 금액과 개수
      const productAmount = productData[month] ? productData[month][0] : 0;
      const productCount = productData[month] ? productData[month][1] : 0;

      // 총 매출 및 총 판매 건수
      const totalAmount = ticketAmount + productAmount;
      const totalCount = ticketCount + productCount;

      return {
        name: `${month}월`,
        총매출: totalAmount,
        티켓매출: ticketAmount,
        상품매출: productAmount,
        티켓판매건수: ticketCount,
        상품판매건수: productCount,
        총판매건수: totalCount,
      };
    });
  };

  const chartData = formatData();

  // 숫자 포맷팅 함수 - 1000 단위 콤마 및 원 표시
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("ko-KR").format(value) + "원";
  };

  // 커스텀 툴팁 컴포넌트
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // 데이터 찾기
      const totalValue = payload.find((p) => p.name === "총 매출")?.value || 0;

      // 현재 월의 원본 데이터 찾기
      const currentMonth = parseInt(label);
      const monthData = chartData.find((item) => item.name === label);

      if (!monthData) return null;

      return (
        <div className="custom-tooltip bg-white p-3 shadow-md rounded border border-gray-200">
          <p className="font-bold">{label}</p>
          <p style={{ color: "#ff7300" }}>
            총 매출: {formatCurrency(totalValue)}
          </p>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-blue-600">
              티켓 매출: {formatCurrency(monthData.티켓매출)}
            </p>
            <p className="text-sm text-blue-500">
              판매 건수: {monthData.티켓판매건수}건
            </p>
            <p className="text-purple-600 mt-1">
              상품 매출: {formatCurrency(monthData.상품매출)}
            </p>
            <p className="text-sm text-purple-500">
              판매 건수: {monthData.상품판매건수}건
            </p>
            <p className="mt-2 pt-1 border-t border-gray-200 text-gray-700">
              총 판매 건수: {monthData.총판매건수}건
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <h2 className="text-lg font-bold mb-2">월별 총 매출 추이</h2>
      <p className="text-sm text-gray-500 mb-4">단위: 원</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" padding={{ left: 10, right: 10 }} />
          <YAxis
            tickFormatter={(value) => {
              if (value >= 10000000) {
                return (value / 10000000).toFixed(1) + "천만";
              } else if (value >= 1000000) {
                return (value / 1000000).toFixed(0) + "백만";
              } else if (value >= 10000) {
                return (value / 10000).toFixed(0) + "만";
              } else if (value >= 1000) {
                return (value / 1000).toFixed(0) + "천";
              }
              return value;
            }}
            width={70}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="총매출"
            stroke="#ff7300"
            strokeWidth={3}
            activeDot={{ r: 8 }}
            dot={{ r: 4 }}
            name="총 매출"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
