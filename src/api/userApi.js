import axios from "axios";

const host = "http://localhost:8089/user";

// axios 인스턴스 생성
const userApi = axios.create({
  baseURL: host,
});

// 요청 인터셉터 설정 - 모든 요청에 토큰 추가
userApi.interceptors.request.use(
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

// 응답 인터셉터 - 토큰 만료 처리
userApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 토큰 만료 에러(401)이고, 이미 재시도하지 않은 경우
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
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
        return userApi(originalRequest);
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

// 장바구니 관련 API
export const addCart = async (data) => {
  const header = { "Content-Type": "multipart/form-data" };
  const res = await userApi.post(`/addcart`, data, { headers: header });
  return res.data;
};

export const getUserPoint = async (uId) => {
  console.log("유아이디가 잘못옴?", uId);
  const res = await userApi.get(`/point/${uId}`);
  return res.data;
};

export const getCartlist = async (userId) => {
  const res = await userApi.get(`/cartlist/${userId}`);
  return res.data;
};

export const deleteFromCart = async (cartNo) => {
  await userApi.delete(`/delete/cart/${cartNo}`);
};

// 주문 관련 API
export const addOrder = async (uid, data) => {
  const header = { "Content-Type": "application/json" };
  const res = await userApi.post(`/purchase/${uid}`, data, { headers: header });
  return res.data;
};

export const addConcertOrder = async (uid) => {
  const res = await userApi.post(`/reservation/${uid}`);
  return res.data;
};
