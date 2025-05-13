import React, { useEffect, useState } from "react";

import SalesBarChart from "./charts/SalesBarChart";
import SalesChart from "./charts/SalesChart";
import AdminMenubar from "../menu/AdminMenubar";
import { getSalesData } from "../../api/adminApi";

const AdminMainComponent = () => {
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2025);

  useEffect(() => {
    setIsLoading(true);
    getSalesData(selectedYear)
      .then((data) => {
        setSalesData(data);
        console.log("받아온 판매 데이터:", data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching sales data:", error);
        setIsLoading(false);
      });
  }, [selectedYear]);

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value, 10));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminMenubar />
      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Main Content */}
        <section className="bg-white p-4 shadow-md rounded-lg mb-6">
          <main className="flex-1 p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">쇼핑몰 관리자 대시보드</h1>
              <div className="flex items-center">
                <label htmlFor="yearSelect" className="mr-2">연도 선택:</label>
                <select
                  id="yearSelect"
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="border rounded px-2 py-1"
                >
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-10">데이터를 불러오는 중입니다...</div>
            ) : (
              <>
                {/* 선형 그래프 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                  <div className="w-full col-span-2">
                    <SalesChart salesData={salesData} />
                  </div>
                </div>

                {/* 막대 그래프 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="w-full col-span-2">
                    <SalesBarChart salesData={salesData} />
                  </div>
                </div>
              </>
            )}
          </main>
        </section>
      </main>
    </div>
  );
};

export default AdminMainComponent;