import React, { useEffect } from "react";
import { FaUser } from "react-icons/fa";
import {
  IoCheckmark as SingleTick,
  IoCheckmarkDone as DoubleTickFinal,
} from "react-icons/io5";
import { IoCheckmarkDone as DoubleTick } from "react-icons/io5";
import { FaRegClock as WaitingClock } from "react-icons/fa6";
import { useState } from "react";
import socket from "../config/socket";
import { updateMessage } from "../slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";
const Message = ({
  msg,
  name = "Someone",
  pos,
  time = "3:00",
  roomId = null,
  picture,
  status = "waiting",
}) => {
  // const [isWaiting, setIsWaiting] = useState(true);
  // const [isSent, setIsSent] = useState(false);
  // const [isReached, setIsReached] = useState(false);
  // const [isRead, setIsRead] = useState(false);
  const userInfo = useSelector((store) => store.user.userInfo);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   socket.on("message", (res) => {
  //     if (res.created) {
  //       if (res.data.roomId == roomId) {
  //         dispatch(
  //           updateMessage({
  //             res,
  //             isOtherUser: res.data.creator != userInfo._id,
  //           })
  //         );
  //       }
  //     }
  //   });
  // }, []);

  return (
    <div
      className={` flex flex-row my-2 relative w-[40%] h-auto  ${
        pos == 0 ? "" : "ml-auto"
      }`}
    >
      {pos == 0 ? (
        <>
          <div className="h-[35px] w-[35px] mx-1">
            <img
              className="h-full w-full rounded-3xl"
              src={
                picture ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxbz8S46qH4I4g7PacDGHeZuKICCu7zk3zlA&s"
              }
            />
          </div>
          <div
            className="flex flex-col rounded-lg bg-white"
            style={{ width: "calc(100% - 35px)" }}
          >
            <div className="w-full bg-yellow-200 text-white text-sm rounded-t-lg pl-2 py-[2px] mb-1">
              {name}
            </div>
            <div className="rounded-lg bg-white min-h-[30px] h-auto px-2 text-sm text-pretty">
              {msg}
            </div>
            <div className="flex flex-row-reverse">
              <div className="flex flex-row items-center mr-2">
                <div className="text-sm text-slate-500 mb-[2px] ">{time}</div>

                <div className="h-[12px] w-[12px] mb-1 mx-1 text-xl">
                  {status == "waiting" ? (
                    <WaitingClock className="h-full w-full mt-[2px]" />
                  ) : status == "created" ? (
                    <SingleTick className="" />
                  ) : status == "delivered" ? (
                    <DoubleTick />
                  ) : status == "seen" ? (
                    <DoubleTickFinal className="text-blue-300" />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          {/* <div className="w-[90%] height-min-[50px] border-2 border-black rounded-lg  bg-white px-2 py-2 text-xl">
            {msg}
          </div> */}
        </>
      ) : (
        <>
          <div
            className="flex flex-col rounded-lg bg-white"
            style={{ width: "calc(100% - 35px)" }}
          >
            <div className="w-full bg-green-200 text-white text-sm rounded-t-lg pl-2 py-[2px] mb-1">
              {name}
            </div>
            <div className="rounded-lg bg-white min-h-[30px] h-auto px-2 text-sm text-pretty">
              {msg}
            </div>
            <div className="flex flex-row-reverse">
              <div className="flex flex-row items-center mr-2">
                <div className="text-sm text-slate-500 mb-[2px] ">{time}</div>
                {/* <div className="h-[12px] w-[12px] mx-1 mb-1">
                  {isWaiting ? (
                    <WaitingClock className="h-full w-full mt-[2px]" />
                  ) : isSent ? (
                    <SingleTick />
                  ) : isReached ? (
                    <DoubleTick />
                  ) : isRead ? (
                    <DoubleTickFinal />
                  ) : null}
                </div> */}
              </div>
            </div>
          </div>
          <div className="h-[35px] w-[35px] mx-1">
            <img
              className="h-full w-full rounded-3xl"
              src={
                picture ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxbz8S46qH4I4g7PacDGHeZuKICCu7zk3zlA&s"
              }
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Message;
