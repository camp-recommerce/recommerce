import React from "react";
import useCustomLoginPage from "../hooks/useCustomLoginPage";
import jwtAxios from "../util/jwtUtil";
import { API_SERVER_HOST } from "../api/userApi";

const host = `${API_SERVER_HOST}`;

const Header = () => {
  const { isLogin } = useCustomLoginPage();

  const handleCheckPermission = async () => {
    try {
      const response = await jwtAxios.get(`${host}/check/validate_token`);
      if (response.status === 200) {
        // 권한이 확인되면 판매 페이지로 리다이렉트
        window.location.href = "/product/register";
      }
    } catch (error) {
      // 권한이 없거나 요청이 실패한 경우 로그인 페이지로 리다이렉트
      window.location.href = "/user/login";
    }
  };

  return (
    <div
      className="header #282222 text-white flex justify-between items-center px-6 py-4 z-[9990]"
      style={{ backgroundColor: "#282222", position: "sticky", top: 0 }}
    >
      <div className="logo">
        <a href="http://localhost:3000/">
          <img src="/images/logo.jpg" alt="Logo" className="h-24 w-auto" />
        </a>
      </div>

      <div
        className="menus flex-grow hidden lg:flex  space-x-6"
        style={{ marginLeft: "70px" }}
      >
        <div className="center flex space-x-6 ">
          <a
            href="http://localhost:3000/auction"
            className="hover:bg-gray-700 rounded-full py-2 px-4 text-lg "
          >
            경매
          </a>
          <button
            onClick={handleCheckPermission}
            className="hover:bg-gray-700 rounded-full py-2 px-4 text-lg"
          >
            중고 판매
          </button>
        </div>
        <div className="center flex space-x-6">
          {isLogin ? (
            <>
              <a
                href="http://localhost:3000/mypage/profile"
                className="hover:bg-gray-700 rounded-full py-2 px-4 text-lg"
              >
                마이페이지
              </a>
              <a
                href="http://localhost:3000/user/logout"
                className="hover:bg-gray-700 rounded-full py-2 px-4 text-lg"
              >
                로그아웃
              </a>
            </>
          ) : (
            <>
              <a
                href="http://localhost:3000/user/login"
                className="hover:bg-gray-700 rounded-full py-2 px-4 text-lg"
              >
                로그인
              </a>
              <a
                href="http://localhost:3000/user/join"
                className="hover:bg-gray-700 rounded-full py-2 px-4 text-lg"
              >
                회원가입
              </a>
            </>
          )}
        </div>
      </div>

      <div>
        {/* <button >
          
        </button> */}
      </div>
      <div class="dropdown lg:hidden">
        <button
          class="btn btn-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          className="bg-[#282222]"
        >
          <img
            src="https://i.pinimg.com/originals/26/9d/d1/269dd16fa1f5ff51accd09e7e1602267.png"
            alt="Menu"
            className="h-20 w-auto"
          />
        </button>
        <ul class="dropdown-menu">
          <li>
            <a class="dropdown-item" href="http://localhost:3000/auction">
              경매
            </a>
          </li>
          <li>
            <button onClick={handleCheckPermission} class="dropdown-item">
              판매하기
            </button>
          </li>

          {isLogin ? (
            <>
              <li>
                <a
                  class="dropdown-item"
                  href="http://localhost:3000/mypage/profile"
                >
                  마이페이지
                </a>
              </li>
              <li>
                <a
                  class="dropdown-item"
                  href="http://localhost:3000/user/logout"
                >
                  로그아웃
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                <a
                  class="dropdown-item"
                  href="http://localhost:3000/user/login"
                >
                  로그인
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="http://localhost:3000/user/join">
                  회원가입
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;
