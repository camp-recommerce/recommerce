import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getWishlistItems, postWishlistItems } from "../api/wishlistApi";

// 비동기 생성자 함수 위시리스트 아이템 가져오기
export const getWishlistItemsAsync = createAsyncThunk(
  "getWishlistItemsAsync",
  () => {
    return getWishlistItems(); // wishlistApi 모듈의 getWishlistItems 함수 호출
  }
);
// 비동기 생성자 함수 위시리스트 아이템 추가
export const postWishlistItemsAsync = createAsyncThunk(
  "postWishlistItemsAsync",
  (param) => {
    return postWishlistItems(param); // wishlistApi 모듈의 postWishlistItems 함수 호출
  }
);
const initState = [];
// wishlistSlice 생성
const wishlistSlice = createSlice({
  name: "wishlistSlice", // slice의 이름
  initialState: [initState], // 초기 상태 설정
  extraReducers: (builder) => {
    builder
      // 위시리스트 아이템 가져오기가 완료되었을 때
      .addCase(getWishlistItemsAsync.fulfilled, (state, action) => {
        console.log("getWishlistItemsAsync fulfilled"); // 콘솔에 로그 출력
        return action.payload; // 액션 페이로드 반환하여 상태 업데이트
      })
      // 위시리스트 아이템 추가가 완료되었을 때
      .addCase(postWishlistItemsAsync.fulfilled, (state, action) => {
        console.log("postWishlistItems fulfilled"); // 콘솔에 로그 출력
        return action.payload; // 액션 페이로드 반환하여 상태 업데이트
      });
  },
});
export default wishlistSlice.reducer; // wishlistSlice 리듀서 반환
