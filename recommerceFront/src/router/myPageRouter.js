import { Suspense, lazy } from "react";
import userSettingRouter from "./userSettingRouter";

const Loading = <div>Loading....</div>;
const Profile = lazy(() =>
  import("../components/user/profile/ProfileComponent")
);
const Auction = lazy(() => import("../components/user/auction/UserAuction"));
const Chat = lazy(() => import("../components/user/chat/UserChatRoom"));
const Setting = lazy(() =>
  import("../components/user/setting/UserSettingComponent")
);
const UserProduct = lazy(() =>
  import("../components/user/UserProductComponent")
);

const PublicProfile = lazy(() =>
  import("../components/user/PublicProfileComponent")
); // 추가

const myPageRouter = () => {
  return [
    {
      path: "profile",
      element: (
        <Suspense fallback={Loading}>
          <Profile />
        </Suspense>
      ),
    },
    {
      path: "auction",
      element: (
        <Suspense fallback={Loading}>
          <Auction />
        </Suspense>
      ),
    },
    {
      path: "chat",
      element: (
        <Suspense fallback={Loading}>
          <Chat />
        </Suspense>
      ),
    },
    {
      path: "by-user",
      element: (
        <Suspense fallback={Loading}>
          <UserProduct />
        </Suspense>
      ),
    },
    {
      path: "setting",
      element: (
        <Suspense fallback={Loading}>
          <Setting />
        </Suspense>
      ),
      children: userSettingRouter(),
    },
    {
      path: "profile/:email",
      element: (
        <Suspense fallback={Loading}>
          <PublicProfile />
        </Suspense>
      ),
    },
  ];
};

export default myPageRouter;
