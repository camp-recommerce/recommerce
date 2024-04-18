import React from "react";
import P_InfiniteComponent from "../../components/product/P_InfiniteComponent";

const P_ListPage = () => {
  return (
    <div
      className="shopList_section flex items-center"
      style={{ width: "100%" }}
    >
      <P_InfiniteComponent />
    </div>
  );
};

export default P_ListPage;
