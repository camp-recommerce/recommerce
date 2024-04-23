import { Suspense, lazy } from "react";

const Loading = <div>Loading....</div>;
const Join = lazy(() => import("../components/user/JoinComponent"));
const Login = lazy(() => import("../components/user/LoginComponent"));
const LogoutPage = lazy(() => import("../components/user/LogoutComponent"));
const KakaoRedirect = lazy(() => import("../pages/user/KakaoRedirectPage"));
const MemberModify = lazy(() => import("../components/user/ModifyComponent"));
const MyPage = lazy(() => import("../components/user/MyPageComponent"));
const Remove = lazy(() => import("../components/user/RemoveComponent"));
const FindPw = lazy(() => import("../components/user/FindPwComponent"));
const Address = lazy(() => import("../components/user/AddressComponent"));
const Profile = lazy(() => import("../components/user/ProfileComponent"));

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
      path: "mypage/:email", // 동적 파라미터로 설정
      element: (
        <Suspense fallback={Loading}>
          <MyPage />
        </Suspense>
      ),
    },
    {
      path: "remove/:email", // 동적 파라미터로 설정
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
    {
      path: "postcode/:email", // 동적 파라미터로 수정
      element: (
        <Suspense fallback={Loading}>
          <Address />
        </Suspense>
      ),
    },
    {
      path: "address/:email", // 주소 업데이트를 위한 동적 파라미터
      element: (
        <Suspense fallback={Loading}>
          <Address />
        </Suspense>
      ),
    },
    {
      path: "profile/:email",
      element: (
        <Suspense fallback={Loading}>
          <Profile />
        </Suspense>
      ),
    },
  ];
};

export default userRouter;
