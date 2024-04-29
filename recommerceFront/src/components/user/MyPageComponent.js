import React, { useState } from "react";
import { useSelector } from "react-redux"; // useSelector를 임포트합니다
import { Link } from "react-router-dom"; // Link import 추가
import styles from "../../scss/user/MyPageComponent.module.scss";
import MyProfileComponent from "./MyProfileComponent";
import UserProductComponent from "./UserProductComponent";
import { API_SERVER_HOST } from "../../api/userApi";

const host = `${API_SERVER_HOST}`;

const MyPageComponent = () => {
  const user = useSelector((state) => state.user); // Redux 스토어에서 user를 가져옵니다
  const [activeMenu, setActiveMenu] = useState("profile");

  return (
    <div className={styles.myPageBundle}>
      <div className={styles.menuBar}>
        <Link to="mypage/myprofile" className={styles.menuItem}>
          {" "}
          {/* Link 컴포넌트로 변경 */}
          프로필
        </Link>
        <Link to="mypage/by-user" className={styles.menuItem}>
          {" "}
          {/* Link 컴포넌트로 변경 */}
          판매목록
        </Link>
        <div
          className={styles.menuItem}
          onClick={() => setActiveMenu("auction")}
        >
          경매
        </div>
        <div className={styles.menuItem} onClick={() => setActiveMenu("chat")}>
          채팅목록
        </div>
        <div
          className={styles.menuItem}
          onClick={() => setActiveMenu("settings")}
        >
          정보설정
        </div>
      </div>
      <div className={styles.infoBundle}>
        {activeMenu === "profile" && <MyProfileComponent />}
        {activeMenu === "sales" && <UserProductComponent />}
        {activeMenu === "settings" && (
          <div className={styles.userInfo}>
            <Link to={`/user/modify`}>
              <button className={styles.button}>정보 변경</button>
            </Link>
            <Link to={`/user/address/${user.email}`}>
              <button className={styles.button}>주소 변경</button>
            </Link>
            <Link to={`/user/password/${user.email}`}>
              <button className={styles.button}>비밀번호 변경</button>
            </Link>
            <Link to={`/user/remove/${user.email}`}>
              <button className={styles.button}>탈퇴하기</button>
            </Link>
          </div>
        )}
        {/* 나머지 메뉴들에 대한 컴포넌트 추가 */}
      </div>
    </div>
  );
};

export default MyPageComponent;
