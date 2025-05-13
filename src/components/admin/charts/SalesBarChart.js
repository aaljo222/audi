import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// Chart.js 요소 등록
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const SalesBarChart = ({ salesData }) => {
  // 백엔드에서 받은 데이터를 차트 형식에 맞게 변환
  const formatChartData = () => {
    if (!salesData || salesData.length < 2) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const ticketData = salesData[0];
    const productData = salesData[1];
    
    // 1월부터 12월까지의 라벨 생성
    const labels = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);
    
    // 티켓 판매 금액 데이터 추출 (0번 인덱스)
    const ticketValues = Array.from({ length: 12 }, (_, i) => {
      const month = (i + 1).toString();
      return ticketData[month] ? ticketData[month][0] : 0; // 배열의 첫 번째 값 (금액)
    });
    
    // 상품 판매 금액 데이터 추출 (0번 인덱스)
    const productValues = Array.from({ length: 12 }, (_, i) => {
      const month = (i + 1).toString();
      return productData[month] ? productData[month][0] : 0; // 배열의 첫 번째 값 (금액)
    });

    return {
      labels: labels,
      datasets: [
        {
          label: "티켓 판매",
          data: ticketValues,
          backgroundColor: "rgba(75, 192, 192, 0.7)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          borderRadius: 5,
          maxBarThickness: 50,
        },
        {
          label: "상품 판매",
          data: productValues,
          backgroundColor: "rgba(153, 102, 255, 0.7)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
          borderRadius: 5,
          maxBarThickness: 50,
        },
      ],
    };
  };

  // 숨겨진 판매 건수 데이터 (툴팁에서만 표시됨)
  const getTooltipData = () => {
    if (!salesData || salesData.length < 2) return {};
    
    const ticketData = salesData[0];
    const productData = salesData[1];
    
    const tooltipData = {};
    
    // 1월부터 12월까지의 데이터 설정
    for (let i = 1; i <= 12; i++) {
      const month = i.toString();
      tooltipData[month] = {
        티켓판매건수: ticketData[month] ? ticketData[month][1] : 0,
        상품판매건수: productData[month] ? productData[month][1] : 0
      };
    }
    
    return tooltipData;
  };

  const tooltipData = getTooltipData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12
          },
          padding: 20
        }
      },
      title: {
        display: false,
        text: '월별 판매 현황',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('ko-KR').format(context.parsed.y) + '원';
            }
            return label;
          },
          afterLabel: function(context) {
            const monthIndex = context.dataIndex + 1;
            const month = monthIndex.toString();
            
            const dataset = context.dataset;
            const datasetLabel = dataset.label;
            
            if (datasetLabel === "티켓 판매") {
              return `판매 건수: ${tooltipData[month]?.티켓판매건수 || 0}건`;
            } else if (datasetLabel === "상품 판매") {
              return `판매 건수: ${tooltipData[month]?.상품판매건수 || 0}건`;
            }
            return null;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)"
        },
        ticks: {
          callback: function(value) {
            if (value >= 10000000) {
              return (value / 10000000).toFixed(1) + '천만원';
            } else if (value >= 1000000) {
              return (value / 1000000).toFixed(0) + '백만원';
            } else if (value >= 10000) {
              return (value / 10000).toFixed(0) + '만원';
            } else if (value >= 1000) {
              return (value / 1000).toFixed(0) + '천원';
            }
            return value + '원';
          },
          font: {
            size: 12
          }
        },
        beginAtZero: true
      }
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 0,
        bottom: 10
      }
    },
    barPercentage: 0.7,
    categoryPercentage: 0.8
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <h2 className="text-lg font-bold mb-2">월별 판매 현황</h2>
      <p className="text-sm text-gray-500 mb-4">티켓 및 상품 판매액 (단위: 원)</p>
      <div style={{ height: "350px", width: "100%" }}>
        <Bar data={formatChartData()} options={options} />
      </div>
    </div>
  );
};

export default SalesBarChart;