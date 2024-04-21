import React from "react";
import P_InfiniteComponent from "../../components/product/P_InfiniteComponent";

const P_ListPage = () => {
  return (
    <div id="parentComponent"  style={{ overflowY: "scroll", height: "400px" }}>
    <P_InfiniteComponent/>
    </div>

  );
};

export default P_ListPage;
