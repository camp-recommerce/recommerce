import React from "react";
import { Outlet } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import MyPageComponent from "../../components/user/MyPageComponent";

const IndexPage = () => {
  return (
    <BasicLayout>
      {/* 상단에 항상 표시될 컴포넌트 */}
      <MyPageComponent />
    </BasicLayout>
  );
};

export default IndexPage;
