import axios from "axios";

const host = "https://www.audimew.store/api/member";

// 회원 API를 위한 axios 인스턴스 생성
const memberApi = axios.create({
  baseURL: host,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 설정 - 인증이 필요한 요청에만 토큰 추가
memberApi.interceptors.request.use(
  (config) => {
    // 인증이 필요하지 않은 엔드포인트 목록
    const publicEndpoints = [
      "/register",
      "/checkUserId",
      "/login",
      "/findId",
      "/findPw",
    ];

    // 현재 요청 경로가 공개 엔드포인트인지 확인
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url.includes(endpoint)
    );

    // 공개 엔드포인트가 아닌 경우에만 토큰 추가
    if (!isPublicEndpoint) {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 토큰 만료 처리
memberApi.interceptors.response.use(
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
        console.log("여기로옴?", refreshToken);
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
        return memberApi(originalRequest);
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

// 공통 헤더 설정 (오직 공개 API용)
const getHeaders = () => {
  return { headers: { "Content-Type": "application/json" } };
};

// 인증이 필요하지 않은 API들 (토큰 없이 호출 가능)

// 회원가입
export const registerUser = async (formData) => {
  const response = await memberApi.post(`/register`, formData);
  console.log("회원가입 성공:", response.data);
  return response.data;
};

// 아이디 중복 확인
export const checkId = async (userId) => {
  const response = await memberApi.post(`/checkUserId`, { userId });
  console.log("아이디 중복 확인 성공: ", response.data);
  return response.data;
};

// 로그인
export const loginPost = async (loginParam) => {
  console.log("loginParam: ", loginParam);
  const res = await memberApi.post(`/login`, {
    userId: loginParam.userId,
    userPw: loginParam.userPw,
  });
  return res.data;
};

// 아이디 찾기
export const findID = async (userName, userEmail) => {
  const res = await memberApi.post(`/findId`, { userName, userEmail });
  return res.data;
};

// 비밀번호 찾기
export const findPw = async (userName, userId) => {
  const res = await memberApi.post(`/findPw`, { userName, userId });
  console.log("비밀번호 찾기 성공", res.data);
  return res.data;
};

// 인증이 필요한 API들 (토큰이 자동으로 포함됨)

// 마이페이지 사용자 정보 가져오기
export const getProfile = async (userId) => {
  const res = await memberApi.get(`/getprofile/${userId}`);
  return res.data;
};

// 마이페이지 사용자 정보 수정하기
export const updateProfile = async (userId, formData) => {
  const res = await memberApi.put(`/updateprofile/${userId}`, formData);
  return res.data;
};

// 주문 내역 불러오기
export const ordersResponse = async (id) => {
  const res = await memberApi.get(`/orders/${id}`);
  console.log("주문 내역 불러오기 성공:", res.data);
  return res.data;
};

// 리뷰 불러오기
export const productReview = async (id) => {
  const res = await memberApi.get(`/review/${id}`);
  console.log("리뷰 불러오기 성공: ", res.data);
  return res.data;
};

//회원 탈퇴
export const deleteUser = async (userId, password) => {
  const res = await memberApi.delete(`/delete/${userId}`, {
    data: { userPw: password, userId },
  });
  return res.data;
};

// 예약 내역 조회 0409
export const getReservation = async (id) => {
  const res = await memberApi.get(`/reservation/${id}`);
  console.log(("예약 내역 잘 불러왔나요???", res.data));
  return res.data;
};

//내 리뷰 삭제 0410
export const deleteReview = async (previewNo) => {
  const res = await memberApi.delete(`delete/review/${previewNo}`);
  console.log("리뷰 삭제 잘 됐나요?", res.data);
  return res.data;
};

//주문 취소 0415
export const refundProduct = async (data) => {
  const res = await memberApi.post(`refund`, data);
  return res.data;
};

export const cancelTicket = async (data) => {
  const res = await memberApi.post(`cancel`, data);
  return res.data;
};

//0422 마이페이지 프로필 이미지 변경
export const updateProfileImage = async (userId, formData) => {
  const res = await memberApi.post(`/profile-image/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // 파일 업로드를 위해 Content-Type 설정
    },
  });
  return res.data;
};

//0422 포인트 조회
export const getPointList = async (id) => {
  const res = await memberApi.get(`point/${id}`);
  return res.data;
};

//0422 마이페이지 프로필 이미지 삭제
export const deleteProfileImage = async (userId) => {
  const res = await memberApi.delete(`/profile/${userId}`);
  return res.data;
};
