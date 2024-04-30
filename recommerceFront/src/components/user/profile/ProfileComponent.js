import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { readUser } from "../../../api/userApi";

import styles from "../../../scss/user/MyPageComponent.module.scss";

const ProfileComponent = () => {
  const user = useSelector((state) => state.loginSlice);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user && user.email) {
      const fetchData = async () => {
        try {
          const userData = await readUser(user.email);
          setUserData(userData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [user]);

  return (
    <div className={styles.profileContainer}>
      <div className={styles.infoBundle}>
        <div className={styles.Pname}>프로필</div>
        {userData && (
          <div className={styles.userInfo}>
            <p>Email: {userData.email}</p>
            <p>닉네임: {userData.nickname}</p>
            <p>휴대폰: {userData.phone}</p>
            <p>생년월일: {userData.birth}</p>
          </div>
        )}
      </div>
      <div className={styles.infoBundle}>
        <div className={styles.Pname}>나의 배송지</div>
        {userData && (
          <div className={styles.userInfo}>
            <p>주소: {userData.address}</p> {/* 주소 정보 표시 */}
            <p>우편번호: {userData.postcode}</p> {/* 우편번호 정보 표시 */}
            <p>상세주소: {userData.addressDetail}</p> {/* 상세주소 정보 표시 */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileComponent;
