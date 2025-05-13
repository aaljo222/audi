import React, { useEffect, useState } from "react";
import { getUserList } from "../../../api/adminApi";

const AdminUserListComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setLoading(true);
    getUserList()
      .then((data) => {
        setData(data);
        setFilteredData(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("사용자 데이터를 가져오는 중 오류 발생:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 검색어가 변경될 때마다 데이터 필터링
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter(
        (user) =>
          user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.userAddress &&
            user.userAddress
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (user.userPhoneNum && user.userPhoneNum.includes(searchTerm))
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, data]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return <div className="p-4 text-center">데이터를 불러오는 중...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">사용자 관리</h2>

      {/* 검색 기능 */}
      <div className="mb-4">
        <div className="flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="이름, 아이디, 이메일, 주소 등으로 검색"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="mt-2 text-sm text-gray-600">
            검색 결과: {filteredData.length}명의 사용자가 검색되었습니다.
          </p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">UID</th>
              <th className="py-2 px-4 border-b text-left">아이디</th>
              <th className="py-2 px-4 border-b text-left">이름</th>
              <th className="py-2 px-4 border-b text-left">이메일</th>
              <th className="py-2 px-4 border-b text-left">주소</th>
              <th className="py-2 px-4 border-b text-left">전화번호</th>
              <th className="py-2 px-4 border-b text-left">상태</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user) => (
              <tr key={user.uid} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{user.uid}</td>
                <td className="py-2 px-4 border-b">{user.userId}</td>
                <td className="py-2 px-4 border-b">{user.userName}</td>
                <td className="py-2 px-4 border-b">{user.userEmail}</td>
                <td className="py-2 px-4 border-b">{user.userAddress}</td>
                <td className="py-2 px-4 border-b">
                  {user.userPhoneNum || "휴대폰번호가 등록되지 않았습니다"}
                </td>
                <td className="py-2 px-4 border-b">
                  {user.deleted ? (
                    <span className="text-red-500">삭제됨</span>
                  ) : (
                    <span className="text-green-500">활성</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-4">
          {searchTerm ? "검색 결과가 없습니다." : "사용자 데이터가 없습니다."}
        </div>
      )}
    </div>
  );
};

export default AdminUserListComponent;
