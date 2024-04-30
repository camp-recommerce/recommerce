import { Suspense, lazy } from "react";

const Loading = <div>Loading....</div>;

const Remove = lazy(() => import("../components/user/RemoveComponent"));
const FindPw = lazy(() => import("../components/user/FindPwComponent"));
const Address = lazy(() => import("../components/user/AddressComponent"));
const MemberModify = lazy(() => import("../components/user/ModifyComponent"));
const PasswordChangeForm = lazy(() =>
  import("../components/user/PasswordChangeFormComponent")
);

const userSettingRouter = () => {
  return [
    {
      path: "remove",
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
      path: "password/:email", // 공개 프로필 페이지 라우트 추가
      element: (
        <Suspense fallback={Loading}>
          <PasswordChangeForm />
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
  ];
};

export default userSettingRouter;
