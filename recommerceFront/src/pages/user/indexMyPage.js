import React from "react";
import { Outlet } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import MyPageComponent from "../../components/user/MyPageComponent";

const IndexMyPage = () => {
  return (
    <BasicLayout>
    <MyPageComponent>
      </MyPageComponent>
      <Outlet />
    </BasicLayout>
  );
};

export default IndexMyPage;
