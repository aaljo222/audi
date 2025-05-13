import axios from "axios";

const host = "http://localhost:8089/admin";

// axios 인스턴스 생성 및 인터셉터 설정
const adminApi = axios.create({
  baseURL: host,
});

// 요청 인터셉터를 추가하여 모든 요청에 토큰 포함
adminApi.interceptors.request.use(
  (config) => {
    // localStorage에서 accessToken 가져오기
    const accessToken = localStorage.getItem("accessToken");

    // 토큰이 있으면 Authorization 헤더에 추가
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가 (토큰 만료 처리를 위한 옵션)
adminApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 토큰 만료 에러(401)이고, 이미 재시도하지 않은 경우
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // refreshToken을 사용하여 새 accessToken 요청
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(
          "http://localhost:8089/auth/refresh",
          { refreshToken }
        );

        // 새 토큰 저장
        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);

        // 원래 요청의 헤더 업데이트
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        // 실패한 요청 재시도
        return adminApi(originalRequest);
      } catch (refreshError) {
        // 리프레시 토큰도 만료된 경우 로그아웃 처리
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");

        // 로그인 페이지로 리다이렉트
        window.location.href = "/member/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// 상품 관련 API
export const postAdd = async (productData) => {
  const header = { headers: { "Content-Type": "multipart/form-data" } };
  const res = await adminApi.post("/add/product", productData, header);
  return res.data;
};

export const getProductList = async () => {
  const res = await adminApi.get("/product/list");
  return res.data;
};

export const getProductByPno = async (pno) => {
  const res = await adminApi.get(`/product/read/${pno}`);
  return res.data;
};

export const modifyProduct = async (productData) => {
  const header = { headers: { "Content-Type": "multipart/form-data" } };
  const res = await adminApi.put("/modify/product", productData, header);
  return res.data;
};

export const deleteProduct = async (pno) => {
  const res = await adminApi.delete(`/remove/product/${pno}`);
  return res.data;
};

// 콘서트 관련 API
export const addConcert = async (concertData) => {
  const header = { headers: { "Content-Type": "multipart/form-data" } };
  const res = await adminApi.post("/add/concert", concertData, header);
  return res.data;
};

export const getConcertList = async () => {
  const res = await adminApi.get("/concert/list");
  return res.data;
};

export const getConcertByCno = async (cno) => {
  const res = await adminApi.get(`/concert/read/${cno}`);
  return res.data;
};

export const modifyConcert = async (concertData) => {
  const header = { headers: { "Content-Type": "multipart/form-data" } };
  const res = await adminApi.put("/modify/concert", concertData, header);
  return res.data;
};

export const deleteConcert = async (cno) => {
  const res = await adminApi.delete(`/remove/concert/${cno}`);
  return res.data;
};

// 주문 관련 API
export const getProductOrderList = async () => {
  const res = await adminApi.get("/product/order/list");
  return res.data;
};

export const getProductOrderDetail = async (ono) => {
  const res = await adminApi.get(`/product/order/detail/${ono}`);
  return res.data;
};

export const modifyProductOrder = async (orderData) => {
  const res = await adminApi.put("/product/order/modify", orderData);
  return res.data;
};

export const getProductRefundList = async () => {
  const res = await adminApi.get("/product/refund/list");
  return res.data;
};

export const getProductRefundDetail = async (refundNo) => {
  const res = await adminApi.get(`/product/refund/${refundNo}`);
  return res.data;
};

export const approveProductRefund = async (refundId, amount) => {
  const res = await adminApi.put(`/product/refund/approve`, {
    refundId: refundId,
    amount: amount,
  });
  return res.data;
};

export const rejectProductRefund = async (refundId, reason) => {
  const res = await adminApi.put(`/product/refund/reject`, {
    refundId: refundId,
    reason: reason,
  });

  return res.data;
};

// 티켓 관련 API
export const getConcertTicketList = async () => {
  const res = await adminApi.get("/concert/ticket/list");
  return res.data;
};

export const getConcertDetail = async (ticketNo) => {
  const res = await adminApi.get(`/concert/ticket/detail/${ticketNo}`);
  return res.data;
};

export const modifyConcertTicket = async (ticketData) => {
  const res = await adminApi.put("/concert/ticket/modify", ticketData);
  return res.data;
};

// 통계 및 리뷰 관련 API
export const getSalesData = async (year) => {
  const res = await adminApi.get(`/statistics/${year}`);
  return res.data;
};

export const getReviewList = async (pno) => {
  const res = await adminApi.get(`/review/list/${pno}`);
  return res.data;
};

export const deleteReview = async (reviewNo) => {
  const res = await adminApi.delete(`/review/remove/${reviewNo}`);
  return res.data;
};

// 사용자 관련 API
export const getUserList = async () => {
  const res = await adminApi.get("/user/list");
  return res.data;
};
