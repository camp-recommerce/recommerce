import { Suspense, lazy } from "react";

const Loading = <div>Loading....</div>;

const Remove = lazy(() => import("../components/user/RemoveComponent"));
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
      path: "address/:email",
      element: (
        <Suspense fallback={Loading}>
          <Address />
        </Suspense>
      ),
    },

    {
      path: "password/:email",
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
