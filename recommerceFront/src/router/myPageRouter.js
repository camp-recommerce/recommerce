import { Suspense, lazy } from "react";

const Loading = <div>Loading....</div>;

const Remove = lazy(() => import("../components/user/RemoveComponent"));
const FindPw = lazy(() => import("../components/user/FindPwComponent"));
const Address = lazy(() => import("../components/user/AddressComponent"));
const MemberModify = lazy(() => import("../components/user/ModifyComponent"));
const Profile = lazy(()=> import("../components/user/profile/ProfileComponent"));
const Auction = lazy(()=> import("../components/user/auction/UserAuction"));
const Chat = lazy(()=> import("../components/user/chat/UserChatRoom"));
const PasswordChangeForm = lazy(() =>
  import("../components/user/PasswordChangeFormComponent")
);
const PublicProfile = lazy(() =>
  import("../components/user/PublicProfileComponent")
); // 추가
const UserProduct = lazy(() =>
  import("../components/user/UserProductComponent")
);

const myPageRouter = () => {
  return [
    {
      path: "profile",
      element: (
        <Suspense fallback={Loading}>
          < Profile/>
        </Suspense>
      ),
    },
    {
      path: "auction",
      element: (
        <Suspense fallback={Loading}>
          < Auction/>
        </Suspense>
      ),
    },
    {
      path: "chat",
      element: (
        <Suspense fallback={Loading}>
          < Chat/>
        </Suspense>
      ),
    },
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
        path: "by-user", // 판매목록 , 판매중, 판매완료 추가
        element: (
          <Suspense fallback={Loading}>
            <UserProduct />
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

export default myPageRouter;
