import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import FixedMenu from "../components/menu/FixedMenu";

const BasicLayout = ({ children }) => {
  return (
    <>
      <Header />
      <FixedMenu />
      {children}
      <Footer />
    </>
  );
};

export default BasicLayout;
