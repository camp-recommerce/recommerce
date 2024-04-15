import React, { useState } from "react";
import { Link } from "react-router-dom";

// import { useSelector } from "react-redux";

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-10 shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">
            <Link to={"/"}>Logo</Link>
          </h1>
          <ul className="flex space-x-4">
            <li>
              <Link to={"/auction"}>경매</Link>
            </li>
            <li>
              <Link to={"/product/add"}>상품 등록</Link>
            </li>
          </ul>
        </div>
        <div>
          <ul className="flex space-x-4">
            <li>
              <Link to={"/user/login"}>로그인</Link>
            </li>
            <li>
              <Link to={"/user/join"}>회원가입</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
