import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { readUser } from "../../../api/userApi";
import {loginSlice} from "../../../slices/loginSlice"

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
    <>
      <div className={styles.infoBundle}>
        { userData && (
          <div className={styles.userInfo}>
            <p>Email: {userData.email}</p>
            <p>닉네임: {userData.nickname}</p>
            <p>휴대폰: {userData.phone}</p>
            <p>생년월일: {userData.birth}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileComponent;
