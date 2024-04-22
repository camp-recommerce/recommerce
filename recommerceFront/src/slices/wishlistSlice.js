import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getWishlistItems, postWishlistItems } from "../api/wishlistApi";

export const getWishlistItemsAsync = createAsyncThunk(
  "getWishlistItemsAsync",
  () => {
    return getWishlistItems();
  }
);

export const postWishlistItemsAsync = createAsyncThunk(
  "postWishlistItemsAsync",
  (param) => {
    return postWishlistItems(param);
  }
);
const initState = [];

const wishlistSlice = createSlice({
  name: "wishlistSlice",
  initialState: [initState],
  extraReducers: (builder) => {
    builder
      .addCase(getWishlistItemsAsync.fulfilled, (state, action) => {
        console.log("getWishlistItemsAsync fulfilled");
        return action.payload;
      })
      .addCase(postWishlistItemsAsync.fulfilled, (state, action) => {
        console.log("postWishlistItems fulfilled");
        return action.payload;
      });
  },
});

export default wishlistSlice.reducer;
