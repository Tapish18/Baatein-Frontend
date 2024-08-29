import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chatSlice",
  initialState: {
    chatsInfo: {},
    currChatRow: {},
  },
  reducers: {
    setCurrChatRow: function (state, action) {
      state.currChatRow = action.payload;
    },
    setChatsInfo: function (state, action) {
      state.chatsInfo = { ...state.chatsInfo, ...action.payload };
    },
    addFriend: function (state, action) {
      if (!state.chatsInfo?.pendingFriends) {
        state.chatsInfo.pendingFriends = [];
      }
      state.chatsInfo.pendingFriends.push(action.payload);
      // state.chatsInfo.pendingFriends.push(action.payload);
    },

    addFriendRequest: function (state, action) {
      state.chatsInfo.requestLists.unshift(action.payload);
    },
    acceptFriendReq: function (state, action) {
      if (state.chatsInfo?.requestLists.length > 0) {
        const filteredReq = state.chatsInfo.requestLists.filter((val) => {
          return val.friend._id == action.payload.id;
        })[0];
        if (filteredReq) {
          filteredReq.room = action.payload.data.roomId;
          filteredReq.status = action.payload.data.status;
          filteredReq.updatedAt = action.payload.data.updatedAt;
          state.chatsInfo.friendList.unshift(filteredReq);
          state.chatsInfo.requestLists = state.chatsInfo.requestLists.filter(
            (val) => {
              return val.friend._id != action.payload.id;
            }
          );
        }
      }
    },
    removeFromPending: function (state, action) {
      if (state.chatsInfo?.pendingFriends.length > 0) {
        const filteredReq = state.chatsInfo.pendingFriends.filter((val) => {
          return val.friend._id == action.payload.id;
        })[0];
        if (filteredReq) {
          filteredReq.room = action.payload.data.roomId;
          filteredReq.status = action.payload.data.status;
          filteredReq.updatedAt = action.payload.data.updatedAt;
          state.chatsInfo.friendList.unshift(filteredReq);
          state.chatsInfo.pendingFriends =
            state.chatsInfo.pendingFriends.filter((val) => {
              return val.friend._id != action.payload.id;
            });
        }
      }
    },
    addMessageAction: function (state, action) {
      if (action.payload.messageChannel == "friend") {
        const idx = state.chatsInfo.friendList.findIndex(
          (val) => val.roomId === action.payload.roomId
        );

        if (idx != -1) {
          const existingMessages =
            state.chatsInfo.friendList[idx].messages || [];
          state.chatsInfo.friendList[idx].messages = [
            action.payload,
            ...existingMessages,
          ];
        }
      }
    },
    updateMessage: function (state, action) {
      if (action.payload.res.data.messageChannel === "friend") {
        const idx = state.chatsInfo.friendList.findIndex(
          (val) => val.roomId === action.payload.res.data.roomId
        );

        if (idx !== -1) {
          const existingMessages =
            state.chatsInfo.friendList[idx].messages || [];
          // console.log(existingMessages);
          // console.log(action.payload.res.data);
          let msg = action.payload.res.data;

          if (action.payload.isOtherUser) {
            msg.status = "delivered";
            if (action.payload.onlyCreated) {
              let msgIdx = state.chatsInfo.friendList[idx].messages.findIndex(
                (val) => val._id == action.payload.res.data._id
              );
              if (msgIdx != -1) {
                state.chatsInfo.friendList[idx].messages[msgIdx] =
                  action.payload.res.data;
              }
            } else {
              state.chatsInfo.friendList[idx].messages = [
                msg,
                ...existingMessages,
              ];
            }
          } else {
            state.chatsInfo.friendList[idx].messages = [
              msg,
              ...existingMessages.splice(1),
            ];
          }
        }
      }
    },
    // updateNotifications: function (state, action) {
    //   if (action.payload.roomId) {
    //     console.log("called from updateNotification");
    //     if (action.payload.messageChannel == "friend") {
    //       const idx = state.chatsInfo.friendList.findIndex(
    //         (val) => val.roomId == action.payload.roomId
    //       );
    //       for (
    //         let i = 0;
    //         i < state.chatsInfo.friendList[idx].messages.length;
    //         i++
    //       ) {
    //         let message = state.chatsInfo.friendList[idx].messages[i];
    //         if (message.status == "seen") {
    //           break;
    //         }
    //         state.chatsInfo.friendList[idx].messages[i] = {
    //           ...message,
    //           status: "seen",
    //           updatedAt: action.payload.updatedAt,
    //         };
    //       }
    //     }
    //   }
    // },
    updateNotifications: function (state, action) {
      if (action.payload.roomId) {
        if (action.payload.messageChannel == "friend") {
          const idx = state.chatsInfo.friendList.findIndex(
            (val) => val.roomId == action.payload.roomId
          );

          if (idx !== -1) {
            for (
              let i = 0;
              i < state.chatsInfo.friendList[idx].messages.length;
              i++
            ) {
              let message = state.chatsInfo.friendList[idx].messages[i];
              if (message.status == "seen") {
                break;
              }
              state.chatsInfo.friendList[idx].messages[i] = {
                ...message,
                status: "seen",
                updatedAt: action.payload.updatedAt,
              };
            }
          }
        }
      }
    },

    updateMessageDelivered: function (state, action) {
      if (action.payload.messageChannel == "friend") {
        const idx = state.chatsInfo.friendList.findIndex(
          (val) => val.roomId == action.payload.roomId
        );
        const msgIdx = state.chatsInfo.friendList[idx].messages.findIndex(
          (val) => val._id == action.payload._id
        );
        if (msgIdx != -1) {
          state.chatsInfo.friendList[idx].messages[msgIdx] = action.payload;
        }
      }
    },

    updateMessagesSeenSelf: function (state, action) {
      if (action.payload.messageChannel == "friend") {
        console.log("called from updateMessagesSeenSelf");
        let roomId;
        if (action.payload.data.length > 0) {
          roomId = action.payload.data[0].roomId;
        }
        if (roomId) {
          const idx = state.chatsInfo.friendList.findIndex(
            (val) => val.roomId == roomId
          );
          const lastNotSeenMsgIdx = state.chatsInfo.friendList[
            idx
          ].messages.findIndex((val) => val.status == "seen");
          if (lastNotSeenMsgIdx != 0) {
            state.chatsInfo.friendList[idx].messages = [
              ...action.payload.data,
              ...state.chatsInfo.friendList[idx].messages.slice(
                lastNotSeenMsgIdx
              ),
            ];
          }
        }
      }
    },

    // acceptFriendReq: function (state, action) {
    //   if (state.chatsInfo?.requestLists.length > 0) {
    //     const filteredReq = state.chatsInfo.requestLists.filter((val) => {
    //       return val.friend._id == action.payload;
    //     })[0];
    //     if (filteredReq) {
    //       state.chatsInfo.friendList.push(filteredReq);
    //       state.chatsInfo.requestLists = state.chatsInfo.requestLists.filter(
    //         (val) => {
    //           return val.friend._id != action.payload;
    //         }
    //       );
    //     }
    //   }
    // },
  },
});

export const {
  setChatsInfo,
  addFriend,
  acceptFriendReq,
  addFriendRequest,
  removeFromPending,
  addMessageAction,
  updateMessage,
  updateNotifications,
  updateMessageDelivered,
  updateMessagesSeenSelf,
  setCurrChatRow,
} = chatSlice.actions;
export default chatSlice.reducer;
