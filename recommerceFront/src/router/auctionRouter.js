import React, { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div>Loading...</div>;
const AuctionList = lazy(() => import("../components/auction/A_ListComponent"));
const AuctionRead = lazy(() => import("../components/auction/A_ReadComponent"));
const AuctionAdd = lazy(() => import("../components/auction/A_AddComponent"));
const AuctionModify = lazy(() =>
  import("../components/auction/A_ModifyComponent")
);

const auctionRouter = () => {
  return [
    {
      path: "list",
      element: (
        <Suspense fallback={Loading}>
          <AuctionList />
        </Suspense>
      ),
    },
    {
      path: "read/:apno",
      element: (
        <Suspense fallback={Loading}>
          <AuctionRead />
        </Suspense>
      ),
    },
    {
      path: "add",
      element: (
        <Suspense fallback={Loading}>
          <AuctionAdd />
        </Suspense>
      ),
    },
    {
      path: "modify/:apno",
      element: (
        <Suspense fallback={Loading}>
          <AuctionModify />
        </Suspense>
      ),
    },

    { path: "", element: <Navigate replace to="list/?page=1&size=4" /> },
    { path: "list", element: <Navigate replace to="list/?page=1&size=4" /> },
  ];
};

export default auctionRouter;
