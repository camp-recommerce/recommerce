import React, { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div>Loading...</div>;
const ImageSlice = lazy(() => import("../pages/MainPage"));
const ProductList = lazy(() =>
  import("../components/product/P_InfiniteComponent")
);
const ProductRead = lazy(() => import("../pages/product/P_ReadPage"));
const ProductAdd = lazy(() => import("../pages/product/P_AddPage"));
const ProductModify = lazy(() => import("../pages/product/P_ModifyPage"));
const P_CartComponent = lazy(() =>
  import("../components/product/cart/P_CartComponent")
);

const productRouter = () => {
  return [
    {
      path: "/",
      element: (
        <div id="parentDiv" style={{ overflowY: "scroll", height: "100vh" }}>
          <ImageSlice />
          <ProductList />
        </div>
      ),
    },
    {
      path: "/product/read/:pno",
      element: (
        <Suspense fallback={Loading}>
          <ProductRead />
        </Suspense>
      ),
    },
    {
      path: "/product/register",
      element: (
        <Suspense fallback={Loading}>
          <ProductAdd />
        </Suspense>
      ),
    },
    {
      path: "/product/modify/:pno",
      element: (
        <Suspense fallback={Loading}>
          <ProductModify />
        </Suspense>
      ),
    },
    {
      path: "product/cart",
      element: (
        <Suspense fallback={Loading}>
          <P_CartComponent />
        </Suspense>
      ),
    },
    { path: "", element: <Navigate replace to="list/?page=1&size=12" /> },
    { path: "list", element: <Navigate replace to="list/?page=1&size=12" /> },
  ];
};

export default productRouter;
