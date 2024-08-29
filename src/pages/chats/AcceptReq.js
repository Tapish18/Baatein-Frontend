import React, { useEffect } from "react";
import { getAuthHeader } from "../../helper/helperFunctions";
import { useDispatch } from "react-redux";
import { acceptFriendReq } from "../../slices/chatSlice";
import socket from "../../config/socket";
const AcceptReq = ({ userInfo }) => {
  const currUser = userInfo?.friend;
  const dispatch = useDispatch();

  function acceptRequestSocket() {
    console.log("called from acceptRequestSocket");
    socket.emit("acceptFriend", currUser?._id);
  }

  //   async function handleAccept() {
  //     try {
  //       const data = await fetch(
  //         process.env.REACT_APP_BASE_URL + "/acceptFriendRequest",
  //         {
  //           method: "POST",
  //           headers: getAuthHeader(),
  //           body: JSON.stringify({
  //             sendersId: currUser?._id,
  //           }),
  //         }
  //       );
  //       const json = await data.json();
  //       if (data.status == 200) {
  //         dispatch(acceptFriendReq(currUser._id));
  //       } else {
  //         console.log(json.message);
  //       }
  //     } catch (error) {
  //       console.log("error occurred : ", error);
  //     }
  //   }

  function handleReject() {
    console.log("Rejected");
  }

  useEffect(() => {
    socket.on("isLive", (data) => {
      if ((data.type = "acceptRequest")) {
        if (data.created) {
          dispatch(acceptFriendReq({ id: currUser?._id, data: data }));
        } else {
          console.log(data.error);
        }
      }
    });
  }, []);

  return (
    <div className="flex flex-col w-full h-full justify-around items-center bg-[rgba(243,242,237,1)]">
      <div className=" flex flex-col min-w-[250px] min-h-[250px] h-2/5 w-2/5 bg-slate-800 rounded-lg shadow-lg">
        <div className="w-full h-2/4 my-3">
          <img
            className="w-2/5 min-w-[120px] h-full object-cover rounded-lg border-2 border-slate-300 mx-[29%]"
            src={currUser?.profileInfo?.profilePhoto}
          />
        </div>
        <div className="flex flex-col w-full text-center">
          <div className="font-bold text-white">
            {currUser?.profileInfo?.username}
          </div>
          <div className="italic text-slate-300 text-xs">{currUser?.email}</div>
        </div>
        <div className="flex flex-row justify-evenly mt-3">
          <button
            onClick={() => {
              acceptRequestSocket();
            }}
            className="text-lg text-white font-semibold py-1 px-5 bg-green-500 rounded-lg mx-1 hover:bg-green-600"
          >
            Accept
          </button>
          <button
            onClick={() => {
              handleReject();
            }}
            className="text-lg text-white font-semibold py-1 px-5 bg-red-500 rounded-lg mx-1 hover:bg-red-600"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptReq;
