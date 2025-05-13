import React, { useState } from "react";
import { postAdd } from "../../../api/adminApi";

const ProductsAddComponent = () => {
  const [formData, setFormData] = useState({
    pname: "",
    price: "",
    pdesc: "",
    pstock: 0,
    category: "",
    uploadFileNames: [],
  });
  const [productImage, setProductImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    const formDataToSend = new FormData();
    formDataToSend.append("pname", formData.pname);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("pdesc", formData.pdesc);
    formDataToSend.append("pstock", formData.pstock);
    formDataToSend.append("category", formData.category);
    if (productImage) {
      formDataToSend.append("files", productImage);
    }
    postAdd(formDataToSend)
      .then((i) => {
        alert(i);
        setFormData({
          pname: "",
          price: "",
          pdesc: "",
          pstock: 0,
          category: "",
          uploadFileNames: [],
        });

        setCoverPreview(""); // 미리보기 초기화
        setProductImage(null);
      })
      .catch((error) => {
        console.error("에러 발생:", error);
        alert("상품 등록 중 오류가 발생했습니다.");
      });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // 사용자가 선택한 파일
    if (file) {
      setProductImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result); // 미리보기 URL 저장
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* 왼쪽 프리뷰 영역 */}
          <div className="w-full md:w-2/5 bg-white p-8 text-black flex flex-col justify-between">
            <div className="flex flex-col items-center justify-center flex-grow">
              {coverPreview ? (
                <div className="w-full flex justify-center mb-4">
                  <div className="relative bg-white w-80 h-80 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={coverPreview}
                      alt="상품 이미지 미리보기"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className=" bg-white w-80 h-80 bgwhite rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-20 w-20 text-orange-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
              <p className="text-sm text-white mt-4 text-center">
                {coverPreview
                  ? "이미지 미리보기"
                  : "상품 이미지를 업로드해주세요"}
              </p>
            </div>
          </div>

          {/* 오른쪽 폼 영역 */}
          <div className="w-full md:w-3/5 p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              상품 정보 입력
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-5">
                {/* 상품명 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    상품명
                  </label>
                  <input
                    type="text"
                    name="pname"
                    value={formData.pname}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="예: 삼성스피커"
                    required
                  />
                </div>

                {/* 가격 및 카테고리 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      상품 가격
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                      placeholder="예: 115,000원"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      카테고리
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white"
                      required
                    >
                      <option value="">카테고리 선택</option>
                      <option value="헤드셋">헤드셋</option>
                      <option value="이어폰">이어폰</option>
                      <option value="스피커">스피커</option>
                      <option value="앰프">앰프</option>
                      <option value=" ">없음</option>
                    </select>
                  </div>
                </div>

                {/* 재고 및 이미지 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      재고
                    </label>
                    <input
                      type="number"
                      name="pstock"
                      value={formData.pstock}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                      placeholder="재고 수량 입력"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      상품 이미지
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        name="coverImage"
                        onChange={handleImageUpload}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                      />
                      <div className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 flex items-center justify-between text-gray-500">
                        <span className="truncate">
                          {productImage
                            ? productImage.name
                            : "이미지 파일 선택"}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 상품 설명 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    상품 설명
                  </label>
                  <textarea
                    name="pdesc"
                    value={formData.pdesc}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    rows="5"
                    placeholder="상품에 대한 설명을 입력하세요."
                    required
                  ></textarea>
                </div>
              </div>

              {/* 제출 버튼 */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-orange-400 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  상품 등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsAddComponent;
