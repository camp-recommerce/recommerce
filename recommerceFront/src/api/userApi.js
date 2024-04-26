import axios from "axios";
import jwtAxios from "../util/jwtUtil";
export const API_SERVER_HOST = "http://localhost:8080";

const host = `${API_SERVER_HOST}/api/user`;

// 로그인
export const loginPost = async (loginParam) => {
  const header = {
    headers: { "Content-Type": "x-www-form-urlencoded" },
  };

  const form = new FormData();
  form.append("username", loginParam.email);
  form.append("password", loginParam.pw);

  const res = await axios.post(`${host}/login`, form, header);
  return res.data;
};

// 사용자 정보 수정
export const modifyUser = async (user) => {
  const res = await jwtAxios.put(`${host}/modify`, user);
  return res.data;
};

// 회원가입
export const joinUser = async (user) => {
  const res = await axios.post(`${host}/join`, user);
  return res.data;
};

// 회원 탈퇴
export const removeUser = async (email) => {
  const res = await jwtAxios.delete(`${host}/remove/${email}`, {});
  return res.data;
};

// 사용자 정보 읽기
export const readUser = async (email) => {
  const res = await jwtAxios.get(`${host}/mypage/${email}`, {});
  return res.data;
};

// 비밀번호 재설정 이메일 전송
export const sendEmail = async (email) => {
  const formData = new URLSearchParams();
  formData.append("email", email);
  const res = await axios.post(`${host}/reset-pw`, formData);
  return res.data;
};

//주소, 우편번호, 상세주소
export const updateAddress = async (
  email,
  address,
  postcode,
  addressDetail
) => {
  const res = await jwtAxios.put(`${host}/address/${email}`, null, {
    params: {
      newAddress: address,
      newPostcode: postcode,
      addressDetail: addressDetail,
    },
  });
  return res.data;
};

// 사용자의 공개 프로필 조회
export const getPublicProfileByEmail = async (email) => {
  const res = await axios.get(`${host}/public-profile/by-email`, {
    params: {
      email: email,
    },
  });
  return res.data;
};

// 특정 사용자 분석 정보 가져오기
export const getUserProfile = async (email) => {
  const res = await axios.get(`${host}/profile/${email}`, {});
  return res.data;
};

// 비밀번호 변경
export const changePassword = async (email, newPassword) => {
  try {
    const res = await axios.put(
      `${API_SERVER_HOST}/api/user/password/${email}`,
      null,
      {
        params: {
          newPassword: newPassword,
        },
      }
    );
    return res.data; // 응답 데이터를 반환합니다.
  } catch (error) {
    console.error("비밀번호 변경 중 오류가 발생했습니다:", error);
    return null; // 오류가 발생하면 null을 반환합니다.
  }
};

// 사용자의 제품 목록 조회
export const fetchProductsByUserFromUserApi = async (
  email,
  soldOut,
  page = 1,
  size = 10,
  sortBy = "pno",
  direction = "DESC"
) => {
  try {
    // 사용자 정보 읽기 API를 호출하여 사용자 정보를 가져옵니다.
    const userData = await readUser(email);

    // 사용자 정보에서 필요한 데이터를 추출합니다.
    // 예시: const userAddress = userData.address;

    // 사용자 정보를 활용하여 제품 목록을 조회하는 API를 호출합니다.
    const response = await axios.get(`${host}/user/by-user`, {
      params: {
        userEmail: email,
        soldOut: soldOut,
        page: page,
        size: size,
        sortBy: sortBy,
        direction: direction,
      },
    });
    return response.data; // 제품 목록 반환
  } catch (error) {
    console.error("제품 목록 조회 중 오류가 발생했습니다:", error);
    return null; // 오류 발생 시 null 반환
  }
};
