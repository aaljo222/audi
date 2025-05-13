import { useEffect, useState } from "react";
import {
  deleteConcert,
  deleteProduct,
  getConcertList,
} from "../../../api/adminApi";
import { useNavigate } from "react-router-dom";

import ConfirmModal from "../../customModal/ConfirmModal";

const TicketListComponent = () => {
  const [concertData, setConcertData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("전체");
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cnoToDelete, setCnoToDelete] = useState(null);
  const [toDelete, setToDelete] = useState("");

  useEffect(() => {
    getConcertList().then((data) => {
      setConcertData(data);
      setFilteredData(data); // 기본적으로 전체 데이터를 필터된 데이터로 설정
      console.log(data);
    });
  }, [refresh]);

  useEffect(() => {
    // 카테고리 필터링
    if (categoryFilter === "전체") {
      setFilteredData(concertData); // "전체"일 경우 모든 데이터 표시
    } else {
      setFilteredData(
        concertData.filter((concert) => concert.category === categoryFilter)
      );
    }
  }, [categoryFilter, concertData]);

  const handleDelete = (cno, cname) => {
    setCnoToDelete(cno);
    setIsModalOpen(true); // 모달 열기
    setToDelete(cname);
  };

  const confirmDelete = () => {
    deleteConcert(cnoToDelete)
      .then((i) => {
        alert(i); // 삭제 성공 시 처리
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.error("삭제 실패:", error); // 실패 시 에러 처리
        alert("삭제 중 오류가 발생했습니다.");
      });
    setIsModalOpen(false); // 모달 닫기
    console.log("삭제 요청:", cnoToDelete);
  };

  const cancelDelete = () => {
    setIsModalOpen(false); // 모달 닫기
    console.log("삭제 취소");
  };

  const handleModify = (cno) => {
    navigate(`/admin/concert/modify/${cno}`);
  };

  return (
    <div className="w-full bg-white p-4 rounded shadow">
      <h1 className="text-xl font-bold mb-4">공연 관리</h1>

      {/* 카테고리 선택 */}
      <div className="mb-4">
        <select
          className="px-4 py-2 border rounded"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="전체">전체</option>
          <option value="콘서트">콘서트</option>
          <option value="클래식">클래식</option>
          <option value="뮤지컬">뮤지컬</option>
          <option value="연극">연극</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">상품번호</th>
              <th className="py-2 px-4 text-left">이미지</th>
              <th className="py-2 px-4 text-left">상품명</th>
              <th className="py-2 px-4 text-left">카테고리</th>
              <th className="py-2 px-4 text-left">가격</th>
              <th className="py-2 px-4 text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((concert) => (
              <tr key={concert.cno} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{concert.cno}</td>
                <td className="py-2 px-4">
                  {concert.imgFileName ? (
                    <img
                      src={`http://localhost:8089/concert/view/s_${concert.imgFileName}`}
                      alt={concert.cname}
                      className="h-16 w-16 object-cover rounded"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                </td>
                <td className="py-2 px-4">{concert.cname}</td>
                <td className="py-2 px-4">{concert.category}</td>
                <td className="py-2 px-4">{concert.cprice}</td>
                <td className="py-2 px-4">
                  <div className="flex justify-center items-center h-full space-x-2">
                    <button
                      onClick={() => handleModify(concert.cno)}
                      className="bg-teal-500 hover:bg-teal-600 text-white py-1 px-3 rounded text-sm"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(concert.cno, concert.cname)}
                      className="bg-purple-500 hover:bg-purple-600 text-white py-1 px-3 rounded text-sm"
                    >
                      삭제
                    </button>
                    <ConfirmModal
                      isOpen={isModalOpen}
                      onConfirm={confirmDelete}
                      onCancel={cancelDelete}
                      pname={toDelete}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          등록된 상품이 없습니다
        </div>
      )}
    </div>
  );
};

export default TicketListComponent;
