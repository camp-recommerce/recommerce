import axios from "axios";
export const API_SERVER_HOST = "http://localhost:8080";

const host = `${API_SERVER_HOST}`;

//상품 리스트 불러오기(메인페이지)
export const getList = async () => {
  const res = await axios.get(`${host}`);
  return res.data;
};

//상품 상세페이지
export const getOne = async (pno) => {
  const res = await axios.get(`${host}/product/read/${pno}`);

  return res.data;
};

//상품 등록페이지
export const postOne = async (product) => {
  const header = { headers: { "Content-Type": "multipart/form-data" } };

  const res = await axios.post(`${host}/product/register`, product, header);

  return res.data;
};

//상품 수정 페이지
export const putOne = async (pno, product) => {
  const header = { headers: { "Content-Type": "multipart/form-data" } };

  const res = await axios.put(`${host}/product/modify${pno}`, product, header);

  return res.data;
};

//상품 삭제하기
export const deleteOne = async (product) => {
  const res = await axios.delete(`${host}/product/delete${product.pno}`, {
    data: product,
  });

  return res.data;
};
