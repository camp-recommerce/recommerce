import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./slices/loginSlice";
import wishlistSlice from "./slices/wishlistSlice";
import chatAlarmSlice from "./slices/chatAlarmSlice";

export default configureStore({
  reducer: {
    loginSlice: loginSlice,
    wishlistSlice: wishlistSlice,
    chatAlarmSlice: chatAlarmSlice,
  },
});
