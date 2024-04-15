import React from "react";
import { Link } from "react-router-dom";

const FooterLayout = () => {
  return (
    <footer className="absolute bottom-0 left-0 w-full bg-gray-200">
      <div className="container mx-auto py-4">
        <div className="flex justify-between items-center">
          <div>Logo</div>
          <div>
            <ul className="flex space-x-2">
              <li>
                <Link to="/">중고</Link>
              </li>
              <li>&ensp;|&ensp;</li>
              <li>
                <Link to="/">위치정보 이용약관</Link>
              </li>
              <li>&ensp;|&ensp;</li>
              <li>
                <Link to="/">개인정보처리방침</Link>
              </li>
              <li>&ensp;|&ensp;</li>
              <li>
                <Link to="/">운영정책</Link>
              </li>
              <li>&ensp;|&ensp;</li>
              <li>
                <Link to="/">Contact Us</Link>
              </li>
            </ul>
            <div>※ 임시 푸터 입니다 (임시 푸터입니다.)</div>
            <div>COPYRIGHT© AUCTION SERVICE INC. ALL RIGHT RESERVED</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterLayout;
