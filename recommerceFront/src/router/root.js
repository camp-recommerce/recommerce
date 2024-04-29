import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import productRouter from "./productRouter";
import userRouter from "./userRouter";
import auctionRouter from "./auctionRouter";

import { CheckoutPage } from "../pages/payments/CheckoutPage";
import { SuccessPage } from "../pages/payments/SuccessPage";
import { FailPage } from "../pages/payments/FailPage";
import { PaymentSuccessPage } from "../pages/payments/PaymentSuccessPage";
const Loading = <div>Loading....</div>;
const ProductIndex = lazy(() => import("../pages/product/P_IndexPage"));
const LoginIndex = lazy(() => import("../pages/user/IndexPage"));
const MyPageIndex = lazy(() => import("../components/user/MyPageComponent"));
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
    path: "/user/mypage",
    element: (
      <Suspense fallback={Loading}>
        <MyPageIndex />
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
  {
    path: "/payment",
    element: <CheckoutPage />,
  },
  {
    path: "/payment/success",
    element: <SuccessPage />,
  },
  {
    path: "/payment/fail",
    element: <FailPage />,
  },
  {
    path: "/payment/success/1",
    element: <PaymentSuccessPage />,
  },
]);

export default root;
