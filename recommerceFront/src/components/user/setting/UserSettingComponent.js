import React from "react";
import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import styles from "../../../scss/user/UserSettings.module.scss";

const UserSettingComponent = () => {
  const user = useSelector((state) => state.loginSlice);

  return (
    <div style={{ minHeight: 600 }}>
      <div className={styles.userInfo}>
        <div className={styles.buttonWrapper}>
          <NavLink
            to="/myPage/setting/modify"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            <button className={styles.button}>정보 변경</button>
          </NavLink>
        </div>
        <div className={styles.buttonWrapper}>
          <NavLink
            to={`/myPage/setting/address/${user.email}`}
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            <button className={styles.button}>주소 변경</button>
          </NavLink>
        </div>
        <div className={styles.buttonWrapper}>
          <NavLink
            to={`/myPage/setting/password/${user.email}`}
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            <button className={styles.button}>비밀번호 변경</button>
          </NavLink>
        </div>
        <div className={styles.buttonWrapper}>
          <NavLink
            to="/myPage/setting/remove"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            <button className={styles.button}>탈퇴하기</button>
          </NavLink>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default UserSettingComponent;
