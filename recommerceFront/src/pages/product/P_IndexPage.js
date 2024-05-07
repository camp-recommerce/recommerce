import React from "react";
import { Outlet } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";

const P_IndexPage = () => {
  return (
    <div>
      <BasicLayout>
        <Outlet />
      </BasicLayout>
    </div>
  );
};

export default P_IndexPage;
