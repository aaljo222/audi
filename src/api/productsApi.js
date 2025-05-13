import axios from "axios";

const host = "http://localhost:8089/product";

export const getList = async (pageParam, category) => {
  const res = await axios.get(`${host}/list/${category}`, {
    params: pageParam,
  });
  return res.data;
};

export const getOne = async (pno) => {
  console.log(pno);
  const res = await axios.get(`${host}/read/${pno.pno}`);
  return res.data;
};

export const getReview = async (pno) => {
  const res = await axios.get(`${host}/getreview/${pno}`);
  return res.data;
};

export const putProduct = async (pno, product) => {
  const header = { headers: { "Content-Type": "multipart/form-data" } };
  const res = await jwtAxios.put(`${host}/${pno}`, product, header);
  return res.data;
};
export const deleteProduct = async (pno) => {
  const res = await jwtAxios.delete(`${host}/${pno}`);
  return res.data;
};
