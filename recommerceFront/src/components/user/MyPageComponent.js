import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { readUser } from "../../api/userApi";

const MyPageComponent = () => {
  const user = useSelector((state) => state.loginSlice);
  const [userData, setUserData] = useState(null);

  const email = user.email;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await readUser(email);
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (email) {
      fetchUserData();
    }
  }, [email]);

  return (
    <div className="myPageBundle">
      <span>My Page</span>
      <div className="InfoBundle">
        {userData && (
          <div className="userInfo">
            <div>E-mail: {userData.email}</div>
            <div>Nickname: {userData.nickname}</div>
            <div>Phone: {userData.phone}</div>
            <div>Birth: {userData.birth}</div>
          </div>
        )}
        <div className="btnBundle">
          <Link to={`/user/modify`}>
            <button>정보 수정</button>
          </Link>
          <Link to={`/user/remove/${email}`}>
            <button>회원 탈퇴</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyPageComponent;
