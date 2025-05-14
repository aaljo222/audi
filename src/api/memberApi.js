import axios from "axios";

const host = "https://www.audimew.store/api/member";

const memberApi = axios.create({
  baseURL: host,
  headers: {
    "Content-Type": "application/json",
  },
});

memberApi.interceptors.request.use(
  (config) => {
    const publicEndpoints = [
      "/register",
      "/checkUserId",
      "/login",
      "/findId",
      "/findPw",
    ];

    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url.includes(endpoint)
    );

    if (!isPublicEndpoint) {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

memberApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post("https://www.audimew.store/api/auth/refresh", { refreshToken });

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

export const registerUser = async (formData) => (await memberApi.post(`/register`, formData)).data;
export const checkId = async (userId) => (await memberApi.post(`/checkUserId`, { userId })).data;
export const loginPost = async (loginParam) => (await memberApi.post(`/login`, loginParam)).data;
export const findID = async (userName, userEmail) => (await memberApi.post(`/findId`, { userName, userEmail })).data;
export const findPw = async (userName, userId) => (await memberApi.post(`/findPw`, { userName, userId })).data;
export const getProfile = async (userId) => (await memberApi.get(`/getprofile/${userId}`)).data;
export const updateProfile = async (userId, formData) => (await memberApi.put(`/updateprofile/${userId}`, formData)).data;
export const ordersResponse = async (id) => (await memberApi.get(`/orders/${id}`)).data;
export const productReview = async (id) => (await memberApi.get(`/review/${id}`)).data;
export const deleteUser = async (userId, password) => (await memberApi.delete(`/delete/${userId}`, { data: { userPw: password, userId } })).data;
export const getReservation = async (id) => (await memberApi.get(`/reservation/${id}`)).data;
export const deleteReview = async (pReviewNo) => (await memberApi.delete(`/delete/review/${pReviewNo}`)).data;
export const refundProduct = async (data) => (await memberApi.post(`/refund`, data)).data;
export const cancelTicket = async (data) => (await memberApi.post(`/cancel`, data)).data;
export const updateProfileImage = async (userId, formData) => (
  await memberApi.post(`/profile-image/${userId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
).data;
export const getPointList = async (id) => (await memberApi.get(`/point/${id}`)).data;
export const deleteProfileImage = async (userId) => (await memberApi.delete(`/profile/${userId}`)).data;
