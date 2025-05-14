import axios from "axios";

// 백엔드 API 주소
const BASE_URL = "https://audime.shop";
const REFRESH_URL = `${BASE_URL}/api/auth/refresh`;

// Axios 인스턴스 생성
const memberApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 인터셉터: 요청 시 Authorization 처리
memberApi.interceptors.request.use(
  (config) => {
    const publicEndpoints = [
      "/api/member/register",
      "/api/member/checkUserId",
      "/api/member/login",
      "/api/member/findId",
      "/api/member/findPw",
    ];

    const isPublic = publicEndpoints.includes(config.url);

    if (!isPublic) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 인터셉터: 응답 시 토큰 만료 재요청 처리
memberApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(REFRESH_URL, { refreshToken });

        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        return memberApi(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");

        window.location.href = "/member/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ✅ 실제 API 함수들
export const registerUser = async (formData) =>
  (await memberApi.post(`/api/member/register`, formData)).data;

export const checkId = async (userId) =>
  (await memberApi.post(`/api/member/checkUserId`, { userId })).data;

export const loginPost = async (loginParam) =>
  (await memberApi.post(`/api/member/login`, loginParam)).data;

export const findID = async (userName, userEmail) =>
  (await memberApi.post(`/api/member/findId`, { userName, userEmail })).data;

export const findPw = async (userName, userId) =>
  (await memberApi.post(`/api/member/findPw`, { userName, userId })).data;

export const getProfile = async (userId) =>
  (await memberApi.get(`/api/member/getprofile/${userId}`)).data;

export const updateProfile = async (userId, formData) =>
  (await memberApi.put(`/api/member/updateprofile/${userId}`, formData)).data;

export const ordersResponse = async (id) =>
  (await memberApi.get(`/api/member/orders/${id}`)).data;

export const productReview = async (id) =>
  (await memberApi.get(`/api/member/review/${id}`)).data;

export const deleteUser = async (userId, password) =>
  (
    await memberApi.delete(`/api/member/delete/${userId}`, {
      data: { userPw: password, userId },
    })
  ).data;

export const getReservation = async (id) =>
  (await memberApi.get(`/api/member/reservation/${id}`)).data;

export const deleteReview = async (pReviewNo) =>
  (await memberApi.delete(`/api/member/delete/review/${pReviewNo}`)).data;

export const refundProduct = async (data) =>
  (await memberApi.post(`/api/member/refund`, data)).data;

export const cancelTicket = async (data) =>
  (await memberApi.post(`/api/member/cancel`, data)).data;

export const updateProfileImage = async (userId, formData) =>
  (
    await memberApi.post(`/api/member/profile-image/${userId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  ).data;

export const getPointList = async (id) =>
  (await memberApi.get(`/api/member/point/${id}`)).data;

export const deleteProfileImage = async (userId) =>
  (await memberApi.delete(`/api/member/profile/${userId}`)).data;
