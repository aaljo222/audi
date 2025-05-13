import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getOne } from "../../api/productsApi";
import ReviewComponent from "../menu/ReviewComponent";
import { addCart } from "../../api/userApi";
import ResultModal from "../common/ResultModal";
import MainMenubar from "../menu/MainMenubar";

const init = [
  {
    productDTO: {},
    reviewRatingDTO: {},
  },
];

const ReadComponent = () => {
  const loginUser = JSON.parse(localStorage.getItem("user"));
  const pno = useParams();
  const navigate = useNavigate();
  const [returnMsg, setReturnMsg] = useState(null);
  const [product, setProduct] = useState(init);
  const [fetching, setFetching] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // 수량 증가/감소 함수
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // 상품 정보 불러오기
  useEffect(() => {
    getOne(pno).then((data) => {
      setProduct(data);
      setFetching(false);
      console.log(data);
    });
  }, [pno]);

  // FormData 객체
  const formDataRef = useRef(new FormData());

  // 사용자 정보 및 상품, 수량 설정
  useEffect(() => {
    // 로그인한 사용자라면, 그 ID를 사용
    if (loginUser) {
      formDataRef.current.set("userId", loginUser.userId);
      formDataRef.current.set("pNo", pno.pno);
      formDataRef.current.set("numOfItem", quantity);
    }
  }, [pno, quantity, loginUser]);

  // 장바구니에 상품 추가
  const clickSubmit = () => {
    // 로그인한 경우
    if (loginUser) {
      addCart(formDataRef.current).then((data) => {
        setReturnMsg(data);
      });
    } else {
      // 비회원인 경우
      alert("로그인 후 이용해 주십시오.");
      navigate("/member/login", { state: { from: location.pathname } });
    }
  };

  // 바로구매 기능
  const handleDirectPurchase = () => {
    // 로그인한 경우에만 바로구매 가능
    if (loginUser) {
      // 바로구매용 데이터 구성
      const directPurchaseData = [
        {
          cartNo: `direct_${Date.now()}`, // 임시 카트번호 (실제 DB에 저장되지 않음)
          userDTO: {
            userId: loginUser.userId,
            userName: loginUser.userName || "",
            userEmail: loginUser.userEmail || "",
            userAddress: loginUser.userAddress || "",
            userPhoneNum: loginUser.userPhoneNum || "",
            uid: loginUser.uid || null,
          },
          productDTO: product.productDTO,
          numofItem: quantity,
        },
      ];

      // 가격 계산 (숫자만 추출)
      const price = product.productDTO.price.replace(/[^0-9]/g, "");
      const priceNumber = parseInt(price);
      if (isNaN(priceNumber)) {
        alert("상품 가격 정보가 올바르지 않습니다.");
        return;
      }

      // 총 가격 계산 및 포맷팅
      const totalPrice = priceNumber * quantity;
      const formattedTotalPrice = new Intl.NumberFormat().format(totalPrice);

      // 페이먼트 페이지로 이동 (direct=true 파라미터 추가)
      navigate(
        `/shopping/payment?totalPrice=${formattedTotalPrice}&cartData=${encodeURIComponent(
          JSON.stringify(directPurchaseData)
        )}&direct=true`
      );
    } else {
      // 비회원인 경우
      alert("로그인 후 이용해 주십시오.");
      navigate("/member/login", { state: { from: location.pathname } });
    }
  };

  // 모달 닫기
  const closeModal = () => {
    setReturnMsg(null);
  };

  return (
    <div className="min-h-screen p-6">
      {returnMsg ? (
        <ResultModal content={returnMsg} callbackFn={closeModal} />
      ) : (
        <></>
      )}
      <MainMenubar currentPage={`/product/read/${pno.pno}`} />
      {/* 전체 컨테이너 */}
      {fetching ? (
        <div className="text-center text-2xl font-bold">로딩 중...</div> // 로딩 상태일 때 표시할 메시지
      ) : (
        <section className="bg-white p-6 border border-[#ad9e87] border-opacity-30 rounded-lg mt-24 flex flex-row w-full md:w-2/3 justify-between mx-auto">
          {/* 왼쪽: 상품 이미지 */}
          <div className="w-1/3 h-auto bg-white p-6 rounded-lg relative overflow-hidden">
            <img
              src={
                product.productDTO.uploadFileNames.length > 0
                  ? `http://localhost:8089/product/view/${product.productDTO.uploadFileNames[0]}`
                  : "/images/defalt.jpg"
              }
              alt="상품 이미지"
              className="h-auto rounded-md mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6"
            />
          </div>

          {/* 오른쪽: 상품 정보 */}
          <div className="w-2/3 h-auto text-left ml-4 flex flex-col">
            <h2 className="text-2xl font-bold">{product.productDTO.pname}</h2>
            <p className="mt-2 text-xl font-bold text-red-600">
              {product.productDTO.price}
            </p>
            <div className="mt-4 p-3 border rounded-lg bg-gray-100">
              <p className="text-gray-600">쿠폰에 관한 정보를 입력하시오</p>
            </div>

            {/* 간단설명 */}
            <div className="mt-4 p-3 border rounded-lg">
              <p className="font-bold">상품설명</p>
              <p
                className="text-gray-600 text-sm mt-1"
                style={{ whiteSpace: "pre-line" }}
              >
                sadffa \n {product.productDTO.pdesc}
              </p>
            </div>

            {/* 상품 옵션 선택 */}
            <div className="mt-4 ml-auto">
              <label className="block font-bold">
                상품의 수량을 선택하세요
              </label>
              <div className="flex items-center space-x-3">
                <button
                  className="px-3 py-2 border rounded-lg text-lg ml-auto "
                  onClick={decreaseQuantity}
                >
                  -
                </button>
                <span className="text-lg font-semibold">{quantity}</span>
                <button
                  className="px-3 py-2 border rounded-lg text-lg"
                  onClick={increaseQuantity}
                >
                  +
                </button>
              </div>
            </div>

            {/* 장바구니 & 바로구매 버튼 */}
            <div className="mt-6 flex gap-2 ">
              <button
                className="w-1/2 p-3 bg-[#ad9e87] text-white rounded-lg"
                onClick={clickSubmit}
              >
                장바구니
              </button>
              <button
                className="w-1/2 p-3 bg-[#ad9e87] text-white rounded-lg"
                onClick={handleDirectPurchase}
              >
                바로구매
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 리뷰 컴포넌트 */}
      {!fetching && (
        <ReviewComponent
          count={product.reviewRatingDTO.reviewcount}
          rating={product.reviewRatingDTO.avgrating}
          pno={pno.pno}
        />
      )}
    </div>
  );
};

export default ReadComponent;
