import React, { useEffect } from "react";
import Message from "./Message";
import socket from "../config/socket";
import { useState, useRef } from "react";

const ChatPlayGround = () => {
  const [val, setVal] = useState("");
  const [myId, setMyId] = useState("");
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  const sendMessage = function (data) {
    console.log(messages);
    socket.emit("sendMsg", {
      msg: data,
      id: myId,
    });
    console.log("!!!!!!!", {
      msg: data,
    });
    setVal("");
  };

  useEffect(() => {
    socket.connect(); // initiate
    socket.on("okConnect", (data) => {
      setMyId(data.id);
      setIsConnected(true);
    });
    socket.on("rcvMsg", (data) => {
      console.log(data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("Time to Shut Down");
    };
  }, []);
  return (
    <div className="flex flex-col items-center justify-between p-1">
      <div className="my-4 w-[150px] h-[50px] bg-blue-500 text-white rounded-lg text-center py-2 text-lg">
        {isConnected ? "Connected" : "Not Connected"}
      </div>

      <div className="w-[50%] h-auto min-h-[400px] border-gray-500 border-2 rounded-lg bg-green-50">
        <div className="h-[50px] bg-yellow-400 shadow-lg text-white m-2 rounded-lg pl-2 py-2">
          <div className="text-3xl text-white font-bold">Bestie ❤ </div>
        </div>
        <div className="mt-4">
          {messages.length > 0 &&
            messages.map((item, idx) => {
              return (
                <Message
                  msg={item.msg}
                  key={idx}
                  pos={item.id == myId ? 0 : 1}
                />
              );
            })}
          {/* <Message msg={"Hi"} pos={0} /> */}
        </div>
      </div>
      <div className="my-5">
        <input
          className="border-black border-2 rounded-lg w-[400px] h-[50px] pl-4"
          type="text"
          value={val}
          onChange={(e) => {
            setVal(e.target.value);
          }}
        />
        <button
          onClick={() => {
            sendMessage(val);
          }}
          className="h-[50px] w-[150px] rounded-lg p-3 mx-4 bg-green-700 text-white"
        >
          Send Message
        </button>
      </div>
    </div>
  );
};

export default ChatPlayGround;
