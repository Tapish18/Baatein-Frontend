import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: {
      isEdit: false,
    },
  },
  reducers: {
    updateUserInfo: function (state, action) {
      state.userInfo = { ...state.userInfo, ...action.payload.userInfo };
    },
    changeEditStatus: function (state, action) {
      state.userInfo.isEdit = !state.userInfo.isEdit;
    },
    updateProfileInfo: function (state, action) {
      if (state.userInfo.profileInfo != undefined) {
        state.userInfo.profileInfo = {
          ...state.userInfo.profileInfo,
          ...action.payload.profileInfo,
        };
      }
    },
    resetUserState: function (state, action) {
      console.log("called from reset");
      // state = {
      //   userInfo: {
      //     isEdit: false,
      //   },
      // };
      return {
        userInfo: {
          isEdit: false,
        },
      };
    },
  },
});

export const {
  updateUserInfo,
  changeEditStatus,
  updateProfileInfo,
  resetUserState,
} = userSlice.actions;
export default userSlice.reducer;
