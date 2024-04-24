import React, { Suspense, lazy } from "react";

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
    {
      path: "product/cart",
      element: (
        <Suspense fallback={Loading}>
          <P_CartComponent />
        </Suspense>
      ),
    },
  ];
};

export default productRouter;
