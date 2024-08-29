import React, { useEffect, useState } from "react";
import { IoPersonAddSharp } from "react-icons/io5";
import { LiaHourglassEndSolid } from "react-icons/lia";
import { getAuthHeader } from "../../helper/helperFunctions";
import { addFriend } from "../../slices/chatSlice";
import { useSelector, useDispatch } from "react-redux";
import socket from "../../config/socket";
const SearchRow = ({ userInfo }) => {
  const [isAddFriend, setIsAddFriend] = useState(false);
  const currUser = useSelector((store) => store.user.userInfo);
  const dispatch = useDispatch();

  function addFriendSocket() {
    socket.emit("addFriend", userInfo._id);
    setIsAddFriend((prev) => !prev);
  }

  // async function handleAddFriend() {
  //   const data = await fetch(process.env.REACT_APP_BASE_URL + "/addFriend", {
  //     method: "POST",
  //     headers: getAuthHeader(),
  //     body: JSON.stringify({ userId: userInfo._id }),
  //   });

  //   const json = await data.json();
  //   if (json.message == "Request sent successfully") {
  //     setIsAddFriend((prev) => !prev);
  //     console.log("called after addFriend State Change");
  //     let createdAt = new Date().toISOString();
  //     const data = {
  //       sender: currUser._id,
  //       status: "pending",
  //       roomId: null,
  //       createdAt: createdAt,
  //       updatedAt: createdAt,
  //       __v: 0,
  //       friend: {
  //         profileInfo: userInfo.profileInfo,
  //         email: userInfo.email,
  //         _id: userInfo._id,
  //       },
  //     };
  //     dispatch(addFriend(data));
  //     console.log("called after dispatch");
  //   } else if (json.message == "Already a friend") {
  //     console.log("Already a friend");
  //   }
  // }

  useEffect(() => {
    socket.on("isLive", (data) => {
      if (data.type == "request") {
        if (data.created) {
          if (userInfo._id == data.data.friend._id) {
            dispatch(addFriend(data.data));
          }
        } else {
          console.log(data.error);
        }
      }
    });
  }, []);

  return (
    <div className="flex flex-row w-[80%] min-h-[50px] box-content border-b-2 border-white my-[2px]">
      <div className="h-[40px] w-[40px] my-2">
        <img
          className="h-full w-full rounded-3xl border-white border-2"
          src={
            userInfo?.profileInfo?.profilePhoto ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpCKq1XnPYYDaUIlwlsvmLPZ-9-rdK28RToA&s"
          }
        />
      </div>
      <div className="flex flex-col flex-grow pl-4 mt-1">
        <div className="text-slate-100 sm:text-sm md:text-lg font-semibold italic">
          {userInfo?.profileInfo?.username || userInfo?.fullName}
        </div>
        <div className="pb-1 text-sm">
          {userInfo?.profileInfo?.about || userInfo?.email}
        </div>
      </div>
      {!isAddFriend ? (
        <IoPersonAddSharp
          onClick={() => {
            addFriendSocket();
          }}
          className="h-[20px] w-[20px] mt-5 cursor-pointer"
        />
      ) : (
        <LiaHourglassEndSolid className="h-[20px] w-[20px] mt-5" />
      )}
    </div>
  );
};

export default SearchRow;
