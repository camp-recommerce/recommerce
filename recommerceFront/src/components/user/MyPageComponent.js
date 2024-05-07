import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom"; // NavLink를 사용합니다.
import { readUser } from "../../api/userApi";
import styles from "../../scss/user/MyPageComponent.module.scss";

const MyPageComponent = () => {
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
    <div className={styles.myPageBundle}>
      <div className={styles.menuBar}>
        <div className={styles.menuItem}>
          <NavLink
            to="/myPage/profile"
            className={({ isActive }) =>
              isActive
                ? `${styles.active} ${styles.fullWidth}`
                : styles.fullWidth
            }
          >
            프로필
          </NavLink>
        </div>

        <div className={styles.menuItem}>
          <NavLink
            to="/myPage/by-user"
            className={({ isActive }) =>
              isActive
                ? `${styles.active} ${styles.fullWidth}`
                : styles.fullWidth
            }
          >
            판매목록
          </NavLink>
        </div>
        <div className={styles.menuItem}>
          <NavLink
            to="/myPage/auction"
            className={({ isActive }) =>
              isActive
                ? `${styles.active} ${styles.fullWidth}`
                : styles.fullWidth
            }
          >
            경매
          </NavLink>
        </div>
        <div className={styles.menuItem}>
          <NavLink
            to="/myPage/chat"
            className={({ isActive }) =>
              isActive
                ? `${styles.active} ${styles.fullWidth}`
                : styles.fullWidth
            }
          >
            메세지 알람
          </NavLink>
        </div>
        <div className={styles.menuItem}>
          <NavLink
            to="/myPage/setting"
            className={({ isActive }) =>
              isActive
                ? `${styles.active} ${styles.fullWidth}`
                : styles.fullWidth
            }
          >
            정보 설정
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default MyPageComponent;
