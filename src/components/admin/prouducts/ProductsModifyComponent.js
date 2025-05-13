import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductByPno, modifyProduct } from "../../../api/adminApi";
import { path } from "framer-motion/client";

const ProductsModifyComponent = () => {
  const { pno } = useParams();
  const [productData, setProductData] = useState([]);
  const [formData, setFormData] = useState({
    pname: "",
    price: "",
    pdesc: "",
    pstock: 0,
    category: "",
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileChanged, setFileChanged] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    getProductByPno(pno).then((i) => {
      setProductData(i);
      console.log(i);
      // 상품 데이터가 로드되면 폼 데이터 초기화
      setFormData({
        pname: i.pname || "",
        price: i.price || "",
        pdesc: i.pdesc || "",
        pstock: i.pstock || 0,
        category: i.category || "",
      });
    });
  }, [pno]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileChanged(true);

      // 미리보기 URL 생성
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitFormData = new FormData();

    submitFormData.append("pno", pno);
    submitFormData.append("pname", formData.pname);
    submitFormData.append("price", formData.price);
    submitFormData.append("pdesc", formData.pdesc);
    submitFormData.append("pstock", formData.pstock);
    submitFormData.append("category", formData.category);

    if (fileChanged && file) {
      submitFormData.append("files", file);
    } else {
      submitFormData.append("uploadFileNames", [
        productData.uploadFileNames[0],
      ]);
    }

    // 확인용 로그
    for (let key of submitFormData.keys()) {
      console.log(key, submitFormData.get(key));
    }
    modifyProduct(submitFormData)
      .then((i) => {
        alert(i);
        navigate("/admin/products/list");
      })
      .catch((error) => {
        console.error("수정 오류:", error);
        alert("상품 수정 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
        상품 수정
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 왼쪽: 이미지 섹션 */}
        <div className="md:col-span-1">
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-700">상품 이미지</h2>

            {/* 현재 이미지 표시 */}
            <div className="bg-gray-50 rounded-lg p-4 flex justify-center items-center h-48">
              {!fileChanged &&
              productData.uploadFileNames &&
              productData.uploadFileNames.length > 0 ? (
                <img
                  src={`http://localhost:8089/product/view/s_${productData.uploadFileNames[0]}`}
                  alt={productData.pname}
                  className="max-h-full max-w-full object-contain rounded"
                />
              ) : fileChanged && previewUrl ? (
                <img
                  src={previewUrl}
                  alt="미리보기"
                  className="max-h-full max-w-full object-contain rounded"
                />
              ) : (
                <div className="bg-gray-200 rounded w-full h-full flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
            </div>

            {/* 파일 업로드 */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지 변경
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              />
              {fileChanged && (
                <p className="text-xs text-red-500 mt-1">
                  새 이미지를 업로드하면 기존 이미지는 삭제됩니다.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 상품번호 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  상품번호
                </label>
                <input
                  type="text"
                  value={productData.pno || ""}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                />
              </div>

              {/* 카테고리 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  카테고리
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">없음</option>
                  <option value="헤드셋">헤드셋</option>
                  <option value="이어폰">이어폰</option>
                  <option value="스피커">스피커</option>
                  <option value="앰프">앰프</option>
                </select>
              </div>
            </div>

            {/* 상품명 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                상품명
              </label>
              <input
                type="text"
                name="pname"
                value={formData.pname}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 가격 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  가격
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* 재고 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  재고
                </label>
                <input
                  type="number"
                  name="pstock"
                  value={formData.pstock}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* 상품 설명 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                상품 설명
              </label>
              <textarea
                name="pdesc"
                value={formData.pdesc}
                onChange={handleChange}
                rows="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              ></textarea>
            </div>

            {/* 버튼 영역 */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => window.history.back()}
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                수정 완료
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductsModifyComponent;
