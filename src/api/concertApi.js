import axios from "axios";

const host = "http://localhost:8089/concert";

// 콘서트 리스트 (카테고리, 페이지네이션)
export const getList = async (pageRequest, category) => {
  const res = await axios.get(`${host}/list/${category}`, {
    params: pageRequest,
  });
  return res.data;
};

// 콘서트 상세 조회
export const getConcertByCno = async (cno) => {
  const res = await axios.get(`${host}/read/${cno}`);
  return res.data;
};

// 콘서트 일정 기반 조회 (예약용)
export const getConcertByCnoAndDate = async (cno, scheduleDate) => {
  const res = await axios.get(`${host}/reservation`, {
    params: {
      cno: cno,
      startTime: scheduleDate,
    },
  });
  return res.data;
};

// ✅ [추가됨] 예매율 기반 랭킹 조회 함수
export const getRankingList = (pageRequestDTO, category) => {
  console.log(category);
  return axios
    .get(`http://localhost:8089/concert/ranking`, category, pageRequestDTO)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching ranking data", error);
      throw error;
    });
};
