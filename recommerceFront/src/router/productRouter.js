import React, { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div>Loading...</div>;
const ImageSlice = lazy(() => import("../pages/MainPage"));
const ProductList = lazy(() => import("../pages/product/P_ListPage"));
const ProductRead = lazy(() => import("../pages/product/P_ReadPage"));
const ProductAdd = lazy(() => import("../pages/product/P_AddPage"));
const ProductModify = lazy(() => import("../pages/product/P_ModifyPage"));

const productRouter = () => {
  return [
    {
      path: "/",
      element: (
        <Suspense fallback={Loading}>
          <ImageSlice />
          <ProductList />
        </Suspense>
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
    { path: "", element: <Navigate replace to="list/?page=1&size=12" /> },
    { path: "list", element: <Navigate replace to="list/?page=1&size=12" /> },
  ];
};

export default productRouter;
