import React, { useEffect } from "react";
import {
  getTimeOrDate,
  getTwentyLettersOrLess,
} from "../../helper/helperFunctions";
import { useSelector, useDispatch } from "react-redux";
import { updateMessage } from "../../slices/chatSlice";
import socket from "../../config/socket";
const ChatRow = ({
  friendInfo,
  type = "chat",
  onClickFunc,
  notificationCount,
}) => {
  const userInfo = friendInfo.friend.profileInfo;
  const loggedInUser = useSelector((store) => store.user.userInfo);
  const dispatch = useDispatch();
  function sendMessageDelivered(v) {
    if (v > 0) {
      const roomId = friendInfo.messages[0].roomId;
      const updatedAt = new Date().toISOString();
      for (let i = 0; i < v; i++) {
        socket.emit("messageDelivered", {
          _id: friendInfo.messages[i]._id,
          roomId: roomId,
          updatedAt: updatedAt,
        });
        let res = {
          data: {
            ...friendInfo.messages[i],
            // status : "delivered",
            updatedAt: updatedAt,
          },
        };
        dispatch(updateMessage({ res, isOtherUser: true, onlyCreated: true }));
      }
    }
  }

  // function getNotificationCount(messagesList) {
  //   let count = 0;
  //   for (let i = 0; i < messagesList.length; i++) {
  //     if (messagesList[i].status == "seen") {
  //       break;
  //     }
  //     count++;
  //   }
  //   return count;
  // }
  useEffect(() => {
    sendMessageDelivered(notificationCount);
  }, [notificationCount]);

  return (
    <div
      className="h-[58px] w-full hover:bg-slate-50 cursor-pointer py-1 border-slate-300"
      style={{ borderBottomWidth: "1px" }}
      onClick={onClickFunc}
    >
      <div className="flex flex-row">
        <div className="h-[50px] w-[50px] ml-2 flex-shrink-0">
          <img
            className="h-full w-full rounded-3xl border-2 object-cover"
            src={
              userInfo?.profilePhoto || "https://freesvg.org/img/1459344336.png"
            }
          />
        </div>
        <div className="flex flex-col flex-auto px-2">
          <div className="flex flex-row justify-between">
            <div className="pl-2">{userInfo?.username || "Someone"}</div>
            <div className="text-slate-400 text-md">{userInfo?.time || ""}</div>
          </div>

          <div className="flex flex-row justify-between ">
            <div className="pl-2 text-xs flex-shrink lg:text-sm text-slate-500">
              {type == "chat"
                ? friendInfo.messages.length > 0
                  ? friendInfo.messages[0].creator == loggedInUser._id
                    ? `You: ${getTwentyLettersOrLess(
                        friendInfo.messages[0].content
                      )}`
                    : `${userInfo.username}: ${getTwentyLettersOrLess(
                        friendInfo.messages[0].content
                      )}`
                  : ""
                : friendInfo?.friend?.email || "someone@gmail.com"}
            </div>
            {type == "chat" ? (
              notificationCount > 0 &&
              friendInfo.messages[0].creator != loggedInUser._id ? (
                <div className="bg-yellow-200 h-[25px] w-[25px] rounded-3xl text-white font-semibold px-2 mr-1">
                  {notificationCount}
                </div>
              ) : null
            ) : (
              <div className="text-slate-600 text-[10px] my-[2px] lg:my-1 px-2 mr-1">
                {getTimeOrDate(friendInfo?.createdAt) || "5:30"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRow;
