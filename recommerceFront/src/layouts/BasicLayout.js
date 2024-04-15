import React from "react";
import HeaderLayout from "./HeaderLayout";
import FooterLayout from "./FooterLayout";

const BasicLayout = ({ children }) => {
  return (
    <>
      <HeaderLayout />
      {children}
      <FooterLayout />
    </>
  );
};

export default BasicLayout;
