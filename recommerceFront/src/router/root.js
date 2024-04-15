import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import productRouter from "./productRouter";
import userRouter from "./userRouter";
import auctionRouter from "./auctionRouter";
const Loading = <div>Loading....</div>;
const ProductIndex = lazy(() => import("../pages/product/P_IndexPage"));
const LoginIndex = lazy(() => import("../pages/user/IndexPage"));
const AuctionIndex = lazy(() => import("../pages/auction/A_IndexPage"));
const root = createBrowserRouter([
  {
    // 일단 로그인 상품 기본 잡아두갰습니다. 각자 필요하면 추가하세요
    path: "/",
    element: (
      <Suspense fallback={Loading}>
        <ProductIndex />
      </Suspense>
    ),
    children: productRouter(),
  },
  {
    path: "/user",
    element: (
      <Suspense fallback={Loading}>
        <LoginIndex />
      </Suspense>
    ),
    children: userRouter(),
  },
  {
    path: "/auction",
    element: (
      <Suspense fallback={Loading}>
        <AuctionIndex />
      </Suspense>
    ),
    children: auctionRouter(),
  },
]);

export default root;
