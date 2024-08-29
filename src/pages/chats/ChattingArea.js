import React, { useRef, useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoSendSharp } from "react-icons/io5";
import Message from "../../components/Message";
import { useSelector, useDispatch } from "react-redux";
import { getTimeOrDate } from "../../helper/helperFunctions";
import socket from "../../config/socket";
import {
  addMessageAction,
  updateMessage,
  updateMessagesSeenSelf,
} from "../../slices/chatSlice";

const ChatingArea = ({ otherUser }) => {
  const textareaRef = useRef(null);
  const userInfo = useSelector((store) => store.user.userInfo);
  const chatInfo = useSelector((store) => store.chat.chatsInfo);
  const [currMessage, setCurrMessage] = useState("");
  const dispatch = useDispatch();

  const handleInput = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto"; // Reset the height
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`; // Adjust the height up to 200px
  };

  function sendMessage() {
    socket.emit("message", { roomId: otherUser.roomId, message: currMessage });
    const created = new Date().toISOString();
    const data = {
      creator: userInfo._id,
      roomId: otherUser.roomId,
      messageType: "text",
      content: currMessage,
      status: "waiting",
      messageChannel: "friend",
      createdAt: created,
      updatedAt: created,
      frontendMessage: true,
    };
    dispatch(addMessageAction(data));
    setCurrMessage("");
  }

  // console.log("fkhdg", otherUser);
  // useEffect(() => {
  //   socket.on("message", (res) => {
  //     if (res.created) {
  //       if (res.data.roomId == otherUser.roomId) {
  //         dispatch(
  //           updateMessage({
  //             res,
  //             isOtherUser: res.data.creator != userInfo._id,
  //           })
  //         );
  //       }
  //       socket.emit("messageDelivered", res._id);
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   socket.on("messageSeen", (data) => {
  //     //data is array of seen messages
  //     dispatch(updateMessagesSeenSelf({ data, messageChannel: "friend" }));
  //   });
  // }, []);

  return (
    <div
      className="flex flex-col flex-auto"
      style={{ height: "calc(100% - 45px)" }}
    >
      <div className="flex-grow flex  flex-col-reverse overflow-y-auto">
        {chatInfo &&
        chatInfo?.friendList?.find(
          (ele, idx, arr) => ele.friend._id == otherUser.friend._id
        )?.messages.length > 0
          ? chatInfo?.friendList
              ?.find((ele, idx, arr) => ele.friend._id == otherUser.friend._id)
              .messages.map((ele, idx) => {
                return (
                  <Message
                    msg={ele.content}
                    time={getTimeOrDate(ele.createdAt)}
                    name={
                      ele.creator == userInfo._id
                        ? "You"
                        : otherUser.friend.profileInfo.username
                    }
                    pos={ele.creator == userInfo._id ? 0 : 1}
                    roomId={otherUser?.roomId}
                    picture={
                      ele.creator == userInfo._id
                        ? userInfo.profileInfo.profilePhoto
                        : otherUser.friend.profileInfo.profilePhoto
                    }
                    status={ele.status}
                    key={idx}
                  />
                );
              })
          : null}
        {/* <Message msg={"hello1"} pos={1} />
        <Message
          msg={
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
          }
          pos={0}
        />
        <Message msg={"hello"} pos={1} />
        <Message msg={"hello"} pos={1} />
        <Message msg={"hello"} pos={1} />
        <Message msg={"hello"} pos={1} />
        <Message msg={"hello"} pos={0} />
        <Message msg={"hello"} pos={1} />
        <Message msg={"hello"} pos={0} /> */}
      </div>
      <div className="bg-slate-200 w-full min-h-[50px] max-h-[200px] flex flex-row p-2 items-end justify-between">
        <FaPlus className="h-[25px] w-[25px] mb-1" />
        <textarea
          style={{ minHeight: "30px" }}
          placeholder="Type a message"
          ref={textareaRef}
          className="w-[90%] max-h-full min-h-[50px] rounded-lg outline-none pl-2  pt-1 mx-2 resize-none overflow-y-auto box-border"
          onInput={handleInput}
          value={currMessage}
          onChange={(e) => {
            setCurrMessage(e.target.value);
          }}
        />
        <IoSendSharp
          onClick={() => {
            sendMessage();
          }}
          className="h-[25px] w-[25px] mb-1"
        />
      </div>
    </div>
  );
};

export default ChatingArea;
