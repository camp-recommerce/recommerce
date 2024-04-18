import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./slices/loginSlice";
import wishlistSlice from "./slices/wishlistSlice";

export default configureStore({
  reducer: {
    loginSlice: loginSlice,
    wishlistSlice: wishlistSlice,
  },
});
