import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import styles from "../../../scss/user/MyPageComponent.module.scss";

const UserSettingComponent = () => {
  const user = useSelector((state) => state.loginSlice);

  return (
    <div>
      <div className={styles.userInfo}>
        <div className={styles.buttonWrapper}>
          <Link to={`/myPage/setting/modify`} key="modify">
            <button className={styles.button}>정보 변경</button>
          </Link>
        </div>
        <div className={styles.buttonWrapper}>
          <Link
            to={`/myPage/setting/address/${user.email}`}
            key="changeAddress"
          >
            <button className={styles.button}>주소 변경</button>
          </Link>
        </div>
        <div className={styles.buttonWrapper}>
          <Link
            to={`/myPage/setting/password/${user.email}`}
            key="changePassword"
          >
            <button className={styles.button}>비밀번호 변경</button>
          </Link>
        </div>
        <div className={styles.buttonWrapper}>
          <Link to={`/myPage/setting/remove`} key="withdraw">
            <button className={styles.button}>탈퇴하기</button>
          </Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
};
export default UserSettingComponent;
