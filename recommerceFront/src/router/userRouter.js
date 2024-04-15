import { Suspense, lazy } from "react";

const Loading = <div>Loading....</div>;
const Join = lazy(() => import("../components/user/JoinComponent"));
const Login = lazy(() => import("../components/user/LoginComponent"));
const LogoutPage = lazy(() => import("../components/user/LogoutComponent"));
const KakaoRedirect = lazy(() =>
  import("../components/user/KakaoRedirctComponent")
);
const MemberModify = lazy(() => import("../components/user/ModifyComponent"));
const MyPage = lazy(() => import("../components/user/MyComponent"));
const Remove = lazy(() => import("../components/user/RemoveComponent"));
const FindPw = lazy(() => import("../components/user/FindPwComponent"));

const userRouter = () => {
  return [
    {
      path: "join",
      element: (
        <Suspense fallback={Loading}>
          <Join />
        </Suspense>
      ),
    },
    {
      path: "login",
      element: (
        <Suspense fallback={Loading}>
          <Login />
        </Suspense>
      ),
    },
    {
      path: "logout",
      element: (
        <Suspense fallback={Loading}>
          <LogoutPage />
        </Suspense>
      ),
    },
    {
      path: "kakao",
      element: (
        <Suspense fallback={Loading}>
          <KakaoRedirect />
        </Suspense>
      ),
    },
    {
      path: "modify",
      element: (
        <Suspense fallback={Loading}>
          <MemberModify />
        </Suspense>
      ),
    },
    {
      path: "mypage/:email",
      element: (
        <Suspense fallback={Loading}>
          <MyPage />
        </Suspense>
      ),
    },
    {
      path: "remove/:email",
      element: (
        <Suspense fallback={Loading}>
          <Remove />
        </Suspense>
      ),
    },
    {
      path: "reset-pw",
      element: (
        <Suspense fallback={Loading}>
          <FindPw />
        </Suspense>
      ),
    },
  ];
};

export default userRouter;
