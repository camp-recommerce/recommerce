import axios from "axios";
import { API_SERVER_HOST } from "./userApi";

const host = `${API_SERVER_HOST}/auction`;

// getList 함수에서의 params 사용 간소화
export const getList = async (pageParam) => {
  const { page, size, apName, apCategory } = pageParam;

  try {
    const res = await axios.get(`${host}/list`, {
      params: { page, size, apName, apCategory },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching auction list:", error);
    throw error; // 오류를 호출자에게 전파
  }
};

export const getOne = async (apno) => {
  const res = await axios.get(`${host}/${apno}`);

  return res.data;
};

export const postOne = async (auction) => {
  const header = { headers: { "Content-Type": "multipart/form-data" } };

  const res = await axios.post(`${host}/`, auction, header);
  // const res = await jwtAxios.post(`${host}/`, auction, header); // 권한 작업 후 jwtAxios로 수정 예정

  return res.data;
};

export const putOne = async (apno, auction) => {
  const header = { headers: { "Content-Type": "multipart/form-data" } };

  const res = await axios.put(`${host}/${apno}`, auction, header);
  // const res = await jwtAxios.put(`${host}/${apno}`, auction, header); // 권한 작업 후 jwtAxios로 수정 예정

  return res.data;
};

export const deleteOne = async (auction) => {
  const res = await axios.delete(`${host}/${auction.apno}`, {
    // const res = await jwtAxios.delete(`${host}/${auction.apno}`, { // 권한 작업 후 jwtAxios로 수정 예정
    data: auction,
  });

  return res.data;
};
