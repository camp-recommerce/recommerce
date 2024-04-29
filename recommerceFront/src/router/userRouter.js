import { Suspense, lazy } from "react";
import MyProfileComponent from "../components/user/MyProfileComponent";

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
const MyProfile = lazy(() => import("../components/user/MyProfileComponent"));
const PasswordChangeForm = lazy(() =>
  import("../components/user/PasswordChangeFormComponent")
);
const PublicProfile = lazy(() =>
  import("../components/user/PublicProfileComponent")
); // 추가
const UserProduct = lazy(() =>
  import("../components/user/UserProductComponent")
);

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
      path: "mypage",
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
    {
      path: "address/:email",
      element: (
        <Suspense fallback={Loading}>
          <Address />
        </Suspense>
      ),
    },
    {
      path: "profile/:email", // 공개 프로필 페이지 라우트 추가
      element: (
        <Suspense fallback={Loading}>
          <PublicProfile />
        </Suspense>
      ),
    },
    {
      path: "password/:email", // 공개 프로필 페이지 라우트 추가
      element: (
        <Suspense fallback={Loading}>
          <PasswordChangeForm />
        </Suspense>
      ),
    },
    {
      path: "mypage/by-user", // 판매목록 , 판매중, 판매완료 추가
      element: (
        <Suspense fallback={Loading}>
          <UserProduct />
        </Suspense>
      ),
    },
    {
      path: "mypage/myprofile", // 판매목록 , 판매중, 판매완료 추가
      element: (
        <Suspense fallback={Loading}>
          <MyProfile />
        </Suspense>
      ),
    },
  ];
};

export default userRouter;
