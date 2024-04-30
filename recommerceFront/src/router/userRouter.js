import { Suspense, lazy } from "react";

const Loading = <div>Loading....</div>;
const Join = lazy(() => import("../components/user/JoinComponent"));
const Login = lazy(() => import("../components/user/LoginComponent"));
const LogoutPage = lazy(() => import("../components/user/LogoutComponent"));
const KakaoRedirect = lazy(() => import("../pages/user/KakaoRedirectPage"));
const MemberModify = lazy(() => import("../components/user/ModifyComponent"));

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
    
  ];
};

export default userRouter;
