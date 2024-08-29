import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import chatSlice from "./slices/chatSlice";
const store = configureStore({
  reducer: {
    user: userSlice,
    chat: chatSlice,
  },
});

export default store;
