import axios from "axios";
import jwtAxios from "../util/jwtUtil";
import { API_SERVER_HOST } from "./userApi";

// 유저 이미지 관련 API의 엔드포인트
const userImageEndpoint = `${API_SERVER_HOST}/api/images`;

// 사용자 이미지 업로드
export const uploadUserImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  const res = await jwtAxios.post(`${userImageEndpoint}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// 유저 이미지 목록 조회
export const getUserImages = async () => {
  // 목록 조회 요청
  const res = await axios.get(`${userImageEndpoint}/list`);
  return res.data;
};

// 유저 이미지 삭제
export const deleteUserImage = async (userEmail) => {
  // userEmail 파라미터 추가
  // 삭제 요청
  const res = await jwtAxios.delete(`${userImageEndpoint}/delete/${userEmail}`); // 사용자 이메일을 경로에 포함
  return res.data;
};
