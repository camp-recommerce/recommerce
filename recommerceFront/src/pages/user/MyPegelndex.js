import React from "react";
import { Outlet } from "react-router-dom";

import MyPageComponent from "../../components/user/MyPageComponent";
import BasicLayout from "../../layouts/BasicLayout";
import UserProductComponent from "../../components/user/UserProductComponent";

const MyPageIndex = () => {
  return (
    <MyPageComponent>
      <Outlet />
    </MyPageComponent>
  );
};

export default MyPageIndex;
