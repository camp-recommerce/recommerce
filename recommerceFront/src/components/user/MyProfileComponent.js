import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { readUser } from "../../api/userApi";
import styles from "../../scss/user/MyPageComponent.module.scss";

const MyProfileComponent = () => {
  const user = useSelector((state) => state.loginSlice);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user && user.email) {
      const fetchData = async () => {
        try {
          const userData = await readUser(user.email);
          setUserData(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchData();
    }
  }, [user]);

  return (
    <div className={styles.userInfo}>
      <h1 className={styles.title}>프로필</h1>
      {userData && (
        <>
          <p>Email: {userData.email}</p>
          <p>닉네임: {userData.nickname}</p>
          <p>휴대폰: {userData.phone}</p>
          <p>생년월일: {userData.birth}</p>
        </>
      )}
    </div>
  );
};

export default MyProfileComponent;
