import React from "react";
import { Outlet } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";

const IndexPage = () => {
  return (
    <BasicLayout>
      {/* 아울렛을 넣어줘야 하위 페이지를 부를수있음, 상위 페이지와, 하위 페이지가 같이 표시됨
    그러니까 indexPage는 해당하는 루트에서 전부 공통적으로 보일것을 넣으면됨(ex : header, footer) */}
      <Outlet />
    </BasicLayout>
  );
};

export default IndexPage;
