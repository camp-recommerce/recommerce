import jwtAxios from "../util/jwtUtil"; // JWT를 사용한 axios 인스턴스
import { API_SERVER_HOST } from "./userApi";

const reviewHost = `${API_SERVER_HOST}/api/reviews`;

// 사용자 후기 생성
export const createUserReview = async (review) => {
  const res = await jwtAxios.post(`${reviewHost}`, review);
  return res.data;
};

// 사용자 후기 ID로 조회
export const getUserReviewById = async (reviewId) => {
  const res = await jwtAxios.get(`${reviewHost}/${reviewId}`);
  return res.data;
};

// 사용자 후기 업데이트
export const updateUserReview = async (reviewId, review) => {
  const res = await jwtAxios.put(`${reviewHost}/${reviewId}`, review);
  return res.data;
};

// 사용자 후기 삭제
export const deleteUserReview = async (reviewId) => {
  const res = await jwtAxios.delete(`${reviewHost}/${reviewId}`);
  return res.data;
};
