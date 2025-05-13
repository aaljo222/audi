import { useEffect, useState } from "react";
import { deleteProduct, getProductList } from "../../../api/adminApi";
import { useNavigate } from "react-router-dom";

import ConfirmModal from "../../customModal/ConfirmModal";

const ProductsListComponent = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [toDelete, setToDelete] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("전체");
  useEffect(() => {
    getProductList().then((data) => {
      setProducts(data);
      setFilteredData(data);
      console.log(data);
    });
  }, [refresh]);
  useEffect(() => {
    // 카테고리 필터링
    if (categoryFilter === "전체") {
      setFilteredData(products); // "전체"일 경우 모든 데이터 표시
    } else {
      setFilteredData(
        products.filter((product) => product.category === categoryFilter)
      );
    }
  }, [categoryFilter, products]);

  const handleDelete = (pno, pname) => {
    setProductToDelete(pno);
    setIsModalOpen(true); // 모달 열기
    setToDelete(pname);
  };
  const confirmDelete = () => {
    deleteProduct(productToDelete)
      .then((i) => {
        alert(i); // 삭제 성공 시 처리
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.error("삭제 실패:", error); // 실패 시 에러 처리
        alert("삭제 중 오류가 발생했습니다.");
      });
    setIsModalOpen(false); // 모달 닫기
    console.log("삭제 요청:", productToDelete);
  };

  const cancelDelete = () => {
    setIsModalOpen(false); // 모달 닫기
    console.log("삭제 취소");
  };

  const handleModify = (pno) => {
    navigate(`/admin/products/modify/${pno}`);
  };

  return (
    <div className="w-full bg-white p-4 rounded shadow">
      <h1 className="text-xl font-bold mb-4">상품 관리</h1>
      <div className="mb-4">
        <select
          className="px-4 py-2 border rounded"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="전체">전체</option>
          <option value="헤드셋">헤드셋</option>
          <option value="스피커">스피커</option>
          <option value="이어폰">이어폰</option>
          <option value="앰프">앰프</option>
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
            {filteredData.map((product) => (
              <tr key={product.pno} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{product.pno}</td>
                <td className="py-2 px-4">
                  {product.imgFileName ? (
                    <img
                      src={`http://localhost:8089/product/view/s_${product.imgFileName}`}
                      alt={product.pname}
                      className="h-16 w-16 object-cover rounded"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                </td>
                <td className="py-2 px-4">{product.pname}</td>
                <td className="py-2 px-4">{product.category}</td>
                <td className="py-2 px-4">{product.price}</td>
                <td className="py-2 px-4">
                  <div className="flex justify-center items-center h-full space-x-2">
                    <button
                      onClick={() => handleModify(product.pno)}
                      className="bg-teal-500 hover:bg-teal-600 text-white py-1 px-3 rounded text-sm"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(product.pno, product.pname)}
                      className="bg-purple-500 hover:bg-purple-600 text-white py-1 px-3 rounded text-sm"
                    >
                      삭제
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/admin/products/reviews/${product.pno}`)
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                    >
                      리뷰관리
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

      {products.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          등록된 상품이 없습니다
        </div>
      )}
    </div>
  );
};

export default ProductsListComponent;
