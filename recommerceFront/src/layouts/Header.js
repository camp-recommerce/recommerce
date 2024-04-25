import React from "react";
import useCustomLoginPage from "../hooks/useCustomLoginPage";

const Header = () => {
  const { isLogin } = useCustomLoginPage();
  return (
    <div
      className="header #282222 text-white flex justify-between items-center px-6 py-4 z-[9998]"
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
          <a
            href="http://localhost:3000/product/register"
            className="hover:bg-gray-700 rounded-full py-2 px-4 text-lg"
          >
            판매하기
          </a>
        </div>
        <div className="center flex space-x-6">
          {isLogin ? (
            <>
              <a
                href="http://localhost:3000/user/mypage/:email"
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
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/5036/5036960.png"
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
            <a
              class="dropdown-item"
              href="http://localhost:3000/product/register"
            >
              판매하기
            </a>
          </li>

          {isLogin ? (
            <>
              <li>
                <a
                  class="dropdown-item"
                  href="http://localhost:3000/user/mypage/:email"
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
