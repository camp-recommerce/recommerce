import axios from "axios";
import { API_SERVER_HOST } from "./userApi";
import jwtAxios from "../util/jwtUtil";

const host = `${API_SERVER_HOST}`;

//상품 리스트 불러오기(메인페이지)
export const getList = async (pageParam) => {
  const { page, size, pname, pcategory, addressLine } = pageParam;

  try {
    const res = await axios.get(`${host}`, {
      params: { page, size, pname, pcategory, addressLine },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching auction list:", error);
    throw error; // 오류를 호출자에게 전파
  }
};

//상품 상세페이지
export const getOne = async (pno) => {
  const res = await axios.get(`${host}/product/read/${pno}`);

  return res.data;
};

//상품 등록페이지
export const postOne = async (product) => {
  const header = { headers: { "Content-Type": "multipart/form-data" } };
  const res = await jwtAxios.post(`${host}/product/register`, product, header);

  return res.data;
};

//상품 수정 페이지
export const putOne = async (pno, product) => {
  const res = await jwtAxios.put(`${host}/product/modify/${pno}`, product);

  return res.data;
};

export const soldOut = async (pno) => {
  const res = await jwtAxios.put(`${host}/product/soldOut/${pno}`);

  return res.data;
};

//상품 삭제하기
export const deleteOne = async (product) => {
  const res = await jwtAxios.delete(`${host}/product/delete/${product.pno}`, {
    data: product,
  });

  return res.data;
};

export const fetchProductsByUserFrom = async (pageParam) => {
  const { page, size, userEmail } = pageParam;
  try {
    const response = await jwtAxios.get(`${host}/user/by-user`, {
      params: {
        userEmail: userEmail,
        page: page,
        size: size,
      },
    });
    return response.data; // 제품 목록 반환
  } catch (error) {
    console.error("제품 목록 조회 중 오류가 발생했습니다:", error);
    return null; // 오류 발생 시 null 반환
  }
};
