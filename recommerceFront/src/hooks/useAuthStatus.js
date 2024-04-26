import { useNavigate } from "react-router-dom";
import jwtAxios from "../util/jwtUtil";
import { API_SERVER_HOST } from "../api/userApi";

const host = API_SERVER_HOST;

const useAuthStatus = () => {
  const navigate = useNavigate();

  const handleAuthRedirect = async (redirectPath, loginPath) => {
    try {
      // jwtAxios를 사용하여 토큰 유효성 검사 요청
      const response = await jwtAxios.get(`${host}/check/validate_token`);

      // 서버 응답이 200 OK인 경우
      if (response.status === 200) {
        navigate(redirectPath);
      } else {
        // 서버 응답이 200이 아닌 경우
        alert("로그인이 필요합니다.");
        navigate(loginPath);
      }
    } catch (error) {
      console.error("토큰 검증 실패", error);
      // 네트워크 에러 또는 다른 예외 처리 시 로그인 페이지로 이동
      navigate(loginPath);
    }
  };

  return handleAuthRedirect;
};

export default useAuthStatus;
