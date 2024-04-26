import { useState, useEffect } from "react";
import jwtAxios from "../util/jwtUtil"; // jwtAxios를 임포트합니다.
import { getCookie } from "../util/cookieUtil";

const useAuthStatus = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userInfo = getCookie("user");
        if (!userInfo) {
          setIsAuthenticated(false);
          return;
        }

        // jwtAxios를 사용하여 간단한 API 요청을 보내 토큰 유효성 검사
        const response = await jwtAxios.get("/api/user/validate_token");
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Authentication validation failed", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return isAuthenticated;
};

export default useAuthStatus;
