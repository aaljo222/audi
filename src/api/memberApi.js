import axios from "axios";

const BASE_URL = "https://www.audime.shop/api/member";
const REFRESH_URL = "https://www.audime.shop/api/auth/refresh";

const memberApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
memberApi.interceptors.request.use(
  (config) => {
    const publicEndpoints = [
      "/register",
      "/checkUserId",
      "/login",
      "/findId",
      "/findPw",
    ];

    const isPublic = publicEndpoints.some((endpoint) =>
      config.url.includes(endpoint)
    );

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

// 응답 인터셉터
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

export const registerUser = async (formData) =>
  (await memberApi.post(`/register`, formData)).data;

export const checkId = async (userId) =>
  (await memberApi.post(`/checkUserId`, { userId })).data;

export const loginPost = async (loginParam) =>
  (await memberApi.post(`/login`, loginParam)).data;

export const findID = async (userName, userEmail) =>
  (await memberApi.post(`/findId`, { userName, userEmail })).data;

export const findPw = async (userName, userId) =>
  (await memberApi.post(`/findPw`, { userName, userId })).data;

export const getProfile = async (userId) =>
  (await memberApi.get(`/getprofile/${userId}`)).data;

export const updateProfile = async (userId, formData) =>
  (await memberApi.put(`/updateprofile/${userId}`, formData)).data;

export const ordersResponse = async (id) =>
  (await memberApi.get(`/orders/${id}`)).data;

export const productReview = async (id) =>
  (await memberApi.get(`/review/${id}`)).data;

export const deleteUser = async (userId, password) =>
  (await memberApi.delete(`/delete/${userId}`, {
    data: { userPw: password, userId },
  })).data;

export const getReservation = async (id) =>
  (await memberApi.get(`/reservation/${id}`)).data;

export const deleteReview = async (pReviewNo) =>
  (await memberApi.delete(`/delete/review/${pReviewNo}`)).data;

export const refundProduct = async (data) =>
  (await memberApi.post(`/refund`, data)).data;

export const cancelTicket = async (data) =>
  (await memberApi.post(`/cancel`, data)).data;

export const updateProfileImage = async (userId, formData) =>
  (
    await memberApi.post(`/profile-image/${userId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  ).data;

export const getPointList = async (id) =>
  (await memberApi.get(`/point/${id}`)).data;

export const deleteProfileImage = async (userId) =>
  (await memberApi.delete(`/profile/${userId}`)).data;
