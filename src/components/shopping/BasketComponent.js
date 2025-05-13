import React, { useEffect, useState } from "react";
import { ShoppingCart, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deleteFromCart, getCartlist } from "../../api/userApi"; // 백엔드 API 호출
import MainMenubar from "../menu/MainMenubar";

const init = [
  {
    cartNo: null,
    userDTO: {
      userId: "",
      userPw: "",
      userName: "",
      userEmail: "",
      userAddress: "",
      userPhoneNum: "",
      uid: null,
    },
    productDTO: {
      pno: null,
      pname: "",
      price: "",
      pdesc: "",
      pstock: null,
      files: [],
      uploadFileNames: [],
    },
    numofItem: 0,
  },
];

const BasketComponent = () => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState(init);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    getCartlist(JSON.parse(localStorage.getItem("user")).userId).then(
      (data) => {
        setCartData(data); // 받아온 데이터를 상태로 저장
      }
    );
  }, [refresh]);

  // 수량 업데이트 함수
  const updateQuantity = (cartNo, amount) => {
    setCartData((prevData) => {
      const updatedData = prevData.map((item) =>
        item.cartNo === cartNo
          ? { ...item, numofItem: Math.max(1, item.numofItem + amount) }
          : item
      );
      return updatedData;
    });
  };

  // 아이템 제거 함수
  const removeItem = (cartNo) => {
    console.log(cartNo);
    deleteFromCart(cartNo).then(() => {
      setRefresh(refresh + 1);
    });
  };

  const totalPrice = cartData.reduce((sum, item) => {
    const price = item.productDTO.price;
    console.log("Price before replace:", price); // 가격을 출력하여 문제 확인
    const cleanedPrice = price.replace(/[^0-9]/g, "");
    console.log("Cleaned Price:", cleanedPrice); // 정리된 가격 출력
    const priceNumber = parseInt(cleanedPrice);
    if (isNaN(priceNumber)) {
      console.error(`Invalid price format: ${price}`);
      return sum;
    }
    return sum + priceNumber * item.numofItem;
  }, 0);
  // 숫자에 콤마 추가하기
  const formattedTotalPrice = new Intl.NumberFormat().format(totalPrice);

  const handlePayment = () => {
    // cartData를 JSON으로 변환하고 URL로 전달
    navigate(
      `/shopping/payment?totalPrice=${formattedTotalPrice}&cartData=${encodeURIComponent(
        JSON.stringify(cartData)
      )}`
    );
  };

  return (
    <div>
      <MainMenubar />
      <div className="mt-24 max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <ShoppingCart size={32} /> 장바구니
        </h1>

        {cartData.length === 0 ? (
          <p className="text-gray-500 text-lg">장바구니가 비어 있습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 장바구니 리스트 */}
            <div className="md:col-span-2 space-y-4">
              {cartData.map((item) => (
                <div
                  key={item.cartNo}
                  className="flex items-center justify-between bg-white shadow-lg p-4 rounded-lg"
                >
                  <img
                    src={
                      item.productDTO.uploadFileNames.length > 0
                        ? `http://localhost:8089/product/view/s_${item.productDTO.uploadFileNames[0]}`
                        : "/images/defalt.png"
                    }
                    alt={item.productDTO.pname}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1 ml-4">
                    <h2 className="text-lg font-semibold">
                      {item.productDTO.pname}
                    </h2>
                    <p className="text-gray-600">
                      {item.productDTO.price} ({item.numofItem}개)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.cartNo, -1)}
                      className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold">
                      {item.numofItem}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.cartNo, 1)}
                      className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.cartNo)}
                    className="text-red-500 ml-4"
                  >
                    <Trash size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* 장바구니 요약 */}
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">최종 결제 금액</h2>
              <p className="text-lg font-semibold mb-2">
                총 가격: {formattedTotalPrice}원
              </p>
              <button
                className="w-full bg-gray-400 text-white py-2 rounded-lg font-semibold hover:bg-gray-500 transition"
                onClick={handlePayment}
              >
                결제하러가기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasketComponent;
