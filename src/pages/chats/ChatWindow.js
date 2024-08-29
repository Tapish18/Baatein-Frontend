import React from "react";
import { useState } from "react";
import { FaVideo } from "react-icons/fa";
import { MdOutlineSearch } from "react-icons/md";
import { BiDotsVerticalRounded } from "react-icons/bi";
import ChatingArea from "./ChattingArea";
import VideoSection from "./VideoSection";
import AcceptReq from "./AcceptReq";
const ChatWindow = ({ userInfo }) => {
  const currUserInfo = userInfo?.friend;
  const status = userInfo?.status;
  const [isVideo, setIsVideo] = useState(false);
  return (
    <>
      <div className="flex flex-row items-center justify-between min-h-[45px] bg-slate-200">
        <div className="flex flex-row  cursor-pointer px-2">
          <div className="h-[35px] w-[35px] mr-2">
            <img
              className="h-full w-full rounded-3xl"
              src={
                currUserInfo?.profileInfo?.profilePhoto ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxbz8S46qH4I4g7PacDGHeZuKICCu7zk3zlA&s"
              }
            />
          </div>
          <div className="mx-2 text-lg my-1">
            {currUserInfo?.profileInfo?.username || "someone"}
          </div>
        </div>
        <div className="flex flex-row pr-4">
          {!isVideo ? (
            <FaVideo
              onClick={() => {
                setIsVideo(true);
              }}
              className="h-[20px] w-[35px] cursor-pointer "
            />
          ) : null}
          <MdOutlineSearch className="h-[20px] w-[30px] cursor-pointer " />
          <BiDotsVerticalRounded className="h-[20px] w-[30px] cursor-pointer" />
        </div>
      </div>
      {status == "pending" ? (
        <AcceptReq userInfo={userInfo} />
      ) : status == "blocked" ? (
        <div>Unblock</div>
      ) : !isVideo ? (
        <ChatingArea otherUser={userInfo} />
      ) : (
        <VideoSection />
      )}
    </>
  );
};

export default ChatWindow;
