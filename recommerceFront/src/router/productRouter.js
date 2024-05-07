import React, { Suspense, lazy } from "react";

const Loading = <div>Loading...</div>;
const MainTop = lazy(() => import("../pages/MainPage"));
const ProductList = lazy(() =>
  import("../components/product/P_InfiniteComponent")
);
const ProductRead = lazy(() => import("../components/product/P_ReadComponent"));
const ProductAdd = lazy(() => import("../components/product/P_AddComponent"));
const ProductModify = lazy(() =>
  import("../components/product/P_ModifyComponent")
);
const P_CartComponent = lazy(() =>
  import("../components/product/cart/P_CartComponent")
);

const productRouter = () => {
  return [
    {
      path: "/",
      element: (
        <Suspense fallback={Loading}>
          <MainTop />
          <ProductList />
        </Suspense>
      ),
    },
    {
      path: "product/read/:pno",
      element: (
        <Suspense fallback={Loading}>
          <ProductRead />
        </Suspense>
      ),
    },
    {
      path: "product/register",
      element: (
        <Suspense fallback={Loading}>
          <ProductAdd />
        </Suspense>
      ),
    },
    {
      path: "product/modify/:pno",
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
