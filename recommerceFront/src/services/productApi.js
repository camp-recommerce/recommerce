import axios from "axios";
export const API_SERVER_HOST = "http://localhost:8080";

const host = `${API_SERVER_HOST}`;

// getList 함수에서의 params 사용 간소화
//상품 리스트 불러오기(메인페이지)
// export const getList = async (pno) => {
//   try {
//     const res = await axios.get(`${host}`, { params: { page, size } });
//     return res.data;
//   } catch (error) {
//     console.error("Error fetching product list:", error);
//     throw error; // 오류를 호출자에게 전파
//   }
// };

//상품 상세페이지
export const getOne = async (pno) => {
  const res = await axios.get(`${host}/products/read/${pno}`);

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
