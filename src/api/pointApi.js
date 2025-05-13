// api/pointsApi.js
import axios from "axios";

// 포인트 적립 API
export const addPoints = async (userId, points, source) => {
  try {
    const response = await axios.post("/api/points/add", {
      userId,
      points,
      source,
    });
    return response.data;
  } catch (error) {
    console.error("포인트 적립 중 오류 발생:", error);
    throw error;
  }
};

// 포인트 업데이트 API (증가 또는 감소)
export const updatePoints = async (userId, points, source) => {
  try {
    const response = await axios.post("/api/points/update", {
      userId,
      points,
      source,
    });
    return response.data;
  } catch (error) {
    console.error("포인트 업데이트 중 오류 발생:", error);
    throw error;
  }
};

// 사용자의 현재 포인트 조회 API
export const getUserPoints = async (userId) => {
  try {
    const response = await axios.get(`/api/user/${userId}/points`);
    return response.data.points;
  } catch (error) {
    console.error("포인트 조회 중 오류 발생:", error);
    throw error;
  }
};
