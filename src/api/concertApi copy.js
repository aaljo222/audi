import axios from "axios";

const host = "http://localhost:8089/concert";

export const getList = async (pageRequest, category) => {
  const res = await axios.get(`${host}/list/${category}`, {
    params: pageRequest,
  });
  return res.data;
};

export const getConcertByCno = async (cno) => {
  const res = await axios.get(`${host}/read/${cno}`);
  return res.data;
};

export const getConcertByCnoAndDate = async (cno, scheduleDate) => {
  const res = await axios.get(`${host}/reservation`, {
    params: {
      cno: cno,
      startTime: scheduleDate,
    },
  });
  return res.data;
};

export const getConcertRankingList = async (
  category = "전체",
  page = 1,
  size = 50
) => {
  const res = await axios.get(`${host}/ranking`, {
    params: {
      category,
      page,
      size,
    },
  });
  return res.data;
};
