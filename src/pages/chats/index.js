import React, { useEffect } from "react";
import ChatWindow from "./ChatWindow";
import ChatRow from "./ChatRow";
import { useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { LuUserPlus2 } from "react-icons/lu";
import { BsBoxArrowLeft } from "react-icons/bs";
import { FaUserFriends } from "react-icons/fa";
import getStarted from "./../../assets/images/getStarted.jpg";
import SearchRow from "./SearchRow";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeEditStatus } from "../../slices/userSlice";
import {
  setChatsInfo,
  addFriendRequest,
  removeFromPending,
  updateMessage,
  updateMessageDelivered,
  updateNotifications,
  updateMessagesSeenSelf,
  setCurrChatRow,
} from "../../slices/chatSlice";
import { getAuthHeader, getToken } from "../../helper/helperFunctions";
import socket from "../../config/socket";

import styled from "styled-components";

const ChatingArea = () => {
  const [isSearchWeb, setIsSearchWeb] = useState(false);
  const [isChatClicked, setIsChatClicked] = useState(-1);
  const [currSellector, setCurrSelector] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [isShowRequests, setIsShowRequests] = useState(false);
  const currChatRow = useSelector((store) => store.chat.currChatRow);
  // const [tempVal, setTempVal] = useState({});
  // const [chatsInfo, setChatsInfo] = useState({});
  const chatsInfo = useSelector((store) => store.chat.chatsInfo);
  const userInfo = useSelector((store) => store.user.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function getChatsInfo() {
    try {
      const res = await fetch(
        process.env.REACT_APP_BASE_URL + "/getChatsInfo",
        {
          method: "GET",
          headers: getAuthHeader(),
        }
      );

      const json = await res.json();
      console.log("chatsInfo");
      if (res.status == 200) {
        dispatch(setChatsInfo(json.data));
        // setChatsInfo(json.data);
      }
    } catch (error) {
      console.log("Error Occured : ", error);
    }
  }

  async function getUsersAction() {
    if (searchText != "") {
      const data = await fetch(
        process.env.REACT_APP_BASE_URL +
          "/getUsers" +
          `?searchText=${searchText}`,
        {
          method: "GET",
          headers: getAuthHeader(),
        }
      );
      const json = await data.json();
      setMatchingUsers(json.data);
    } else {
      setMatchingUsers([]);
    }
  }
  function getRoomIds() {
    let roomIds = [];
    if (chatsInfo?.friendList) {
      roomIds = [
        ...chatsInfo.friendList.map((val) => {
          return val.roomId;
        }),
      ];
    }
    if (chatsInfo?.groupsList) {
      roomIds = [
        ...chatsInfo.groupsList.map((val) => {
          return val.roomId;
        }),
      ];
    }
    return roomIds;
  }

  function chatRowNotificationSeen(roomId) {
    let updatedAt = new Date().toISOString();
    socket.emit("messageSeen", { roomId, updatedAt: updatedAt });
    dispatch(
      updateNotifications({ roomId, messageChannel: "friend", updatedAt })
    );
  }
  function getNotificationCount(messagesList) {
    let count = 0;
    for (let i = 0; i < messagesList.length; i++) {
      if (messagesList[i].status == "seen") {
        break;
      }
      count++;
    }
    return count;
  }

  useEffect(() => {
    let id;
    id = setTimeout(() => {
      getUsersAction();
    }, 200);

    return () => {
      clearTimeout(id);
    };
  }, [searchText]);
  // useEffect(() => {
  //   if (!getToken()) {
  //     navigate("/");
  //   }
  // }, []);

  useEffect(() => {
    let rooms = getRoomIds();
    if (rooms.length > 0) {
      socket.emit("joinRooms", rooms);
    }
    console.log(rooms);
  }, [chatsInfo, getChatsInfo]);

  // useEffect(() => {
  //   getChatsInfo();
  //   socket.connect();
  //   socket.on("addFriend", (data) => {
  //     console.log("addFriend Called");
  //     dispatch(addFriendRequest(data));
  //   });
  //   socket.on("friendsMade", (data) => {
  //     dispatch(removeFromPending({ id: data.receiver, data: data }));
  //   });
  // }, []);
  useEffect(() => {
    if (!getToken()) {
      navigate("/");
    }
    getChatsInfo();
    socket.connect();
    socket.on("addFriend", (data) => {
      console.log("addFriend Called");
      dispatch(addFriendRequest(data));
    });
    socket.on("friendsMade", (data) => {
      dispatch(removeFromPending({ id: data.receiver, data: data }));
    });
    socket.on("message", (res) => {
      if (res.created) {
        console.log("===============", currChatRow);
        dispatch(
          updateMessage({
            res,
            isOtherUser: res.data.creator != userInfo._id,
          })
        );
        if (res.data.creator != userInfo._id) {
          socket.emit("messageDelivered", {
            _id: res.data._id,
            roomId: res.data.roomId,
            updatedAt: new Date().toISOString(),
          });
        }
        console.log(
          "currChatRow.roomId == res.data.roomId",
          currChatRow.roomId == res.data.roomId
        );
        console.log("currChatRow", currChatRow);
        console.log("res.data.roomId", res.data.roomId);
        if (
          res.data.creator != userInfo._id &&
          currChatRow.roomId &&
          currChatRow.roomId == res.data.roomId
        ) {
          chatRowNotificationSeen(currChatRow.roomId);
        }
      }
    });
    socket.on("messageDelivered", (res) => {
      if (res.updated) {
        dispatch(updateMessageDelivered(res.data));
      }
    });
    socket.on("messageSeen", (data) => {
      //data is array of seen messages
      dispatch(updateMessagesSeenSelf({ data, messageChannel: "friend" }));
    });
    return () => {
      socket.off("message");
      socket.off("messageDelivered");
      socket.off("messageSeen");
    };
  }, [currChatRow]);
  console.log(currChatRow);
  return (
    <Root className=" relative h-[85vh] w-[full] flex flex-row rounded-lg">
      <div
        className={`absolute h-full flex flex-col w-[30%] min-w-[250px] border-r-2 border-slate-300 bg-[#f5b218] transition-all ease-in-out ${
          isSearchWeb
            ? "translate-x-0 opacity-100 delay-400"
            : "-translate-x-full opacity-0 delay-0"
        }`}
      >
        <div className="flex flex-col min-h-[45px] pl-2 py-2">
          <BsBoxArrowLeft
            onClick={() => {
              setSearchText("");
              setIsSearchWeb(false);
            }}
            className="h-full w-[30px] text-white font-bold cursor-pointer"
          />
        </div>
        <div
          className="flex flex-col flex-grow"
          style={{ height: "calc(100% - 45px)" }}
        >
          <div className="w-full min-h-[50px] py-2 text-center">
            <input
              placeholder="Search on web"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              className="outline-none w-3/4 rounded-lg bg-slate-200 text-slate-600 pl-4 text-sm py-2 mb-2 shadow-lg"
              type="text"
            />
          </div>
          <div
            className="flex flex-col w-full items-center overflow-auto p-2"
            style={{ height: "calc(100% - 50px)" }}
          >
            {(searchText != "" && matchingUsers.length) > 0 &&
              matchingUsers.map((val, idx) => (
                <SearchRow userInfo={val} key={idx} />
              ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col w-[30%] min-w-[250px] border-r-2 border-slate-300 bg-white rounded-lg rounded-r-none">
        <div className="flex flex-col border-b-2 border-slate-200 h-[33%] min-h-[180px] w-full">
          <div className="flex flex-row min-h-[45px] justify-between items-center bg-slate-200 ">
            <div className="h-[35px] w-[35px] ml-2">
              <img
                onClick={() => {
                  dispatch(changeEditStatus());
                  navigate("/info");
                }}
                className="h-full w-full rounded-3xl cursor-pointer"
                src={userInfo?.profileInfo?.profilePhoto}
              />
            </div>
            <div className="flex flex-row">
              <div
                onClick={() => {
                  setIsShowRequests((prev) => !prev);
                }}
                className="flex flex-row cursor-pointer mr-2"
              >
                <FaUserFriends className="h-[20px] w-[20px]" />
                {chatsInfo && chatsInfo?.requestLists?.length > 0 ? (
                  <span className="bg-yellow-400 h-[15px] w-[15px] rounded-full text-xs pl-1 pb-4  mt-[10px] -mx-1 text-white">
                    {chatsInfo?.requestLists?.length}
                  </span>
                ) : null}
              </div>
              <LuUserPlus2
                onClick={() => {
                  setIsSearchWeb(true);
                }}
                className="h-[20px] w-[30px] cursor-pointer mx-2"
              />
              <BiDotsVerticalRounded className="h-[20px] w-[30px] cursor-pointer ml-2" />
            </div>
          </div>
          <div className="flex-grow px-4 py-2">
            <input
              placeholder="Search"
              className="outline-none w-full rounded-lg bg-slate-200 text-slate-600 pl-4 text-sm py-2 mb-2"
              type="text"
            />
            <div className="flex flex-row flex-wrap justify-evenly items-center w-full py-2">
              <button
                onClick={() => {
                  setCurrSelector("all");
                  setIsShowRequests(false);
                }}
                className={`text-slate-500 rounded-xl px-2 py-1 mx-2 mb-1 bg-slate-200 h-auto w-auto ${
                  currSellector == "all"
                    ? "bg-yellow-100"
                    : " hover:bg-slate-300"
                }`}
              >
                All
              </button>
              <button
                onClick={() => {
                  setCurrSelector("unread");
                  setIsShowRequests(false);
                }}
                className={` text-slate-500 rounded-xl px-2 py-1 mx-2 mb-1 bg-slate-200 h-auto w-auto ${
                  currSellector == "unread"
                    ? "bg-yellow-100"
                    : " hover:bg-slate-300"
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => {
                  setCurrSelector("groups");
                  setIsShowRequests(false);
                }}
                className={`text-slate-500 rounded-xl px-2 py-1 mx-2 mb-1 bg-slate-200 h-auto w-auto ${
                  currSellector == "groups"
                    ? "bg-yellow-100"
                    : " hover:bg-slate-300"
                }`}
              >
                Groups
              </button>
              <button
                onClick={() => {
                  setCurrSelector("pending");
                  setIsShowRequests(false);
                }}
                className={`text-slate-500 rounded-xl px-2 py-1 mx-2 mb-1 bg-slate-200 h-auto w-auto ${
                  currSellector == "pending"
                    ? "bg-yellow-100"
                    : " hover:bg-slate-300"
                }`}
              >
                Pending
              </button>
            </div>
          </div>
        </div>
        {chatsInfo == {} ? (
          <div className="flex-grow my-[40%]">
            <div className="font-bold text-2xl text-center italic text-slate-400 h-1/4 min-h-[100px] w-full">
              loading your chats.....
            </div>
          </div>
        ) : isShowRequests ? (
          chatsInfo.requestLists.length > 0 ? (
            <div className="flex flex-grow flex-col">
              {chatsInfo.requestLists.map((val, idx) => {
                return (
                  <ChatRow
                    onClickFunc={() => {
                      dispatch(setCurrChatRow(val));
                      setIsChatClicked(0);
                    }}
                    type="req"
                    friendInfo={val}
                    key={idx}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col flex-grow pt-16">
              <div className="min-h-[100px] w-full h-1/6 text-center mb-4">
                <img
                  className="h-inherit min-w-[100px] w-1/4 mx-[37.5%]"
                  src="https://static.vecteezy.com/system/resources/previews/012/269/128/original/worried-emoji-illustration-on-white-background-vector.jpg"
                />
              </div>
              <div className="sm:text-2xl md:text-3xl lg:text-4xl font-semibold italic text-center">
                No New Connection Requests
              </div>
            </div>
          )
        ) : chatsInfo?.friendList?.length ||
          0 + chatsInfo?.groupsList?.length ||
          0 + chatsInfo?.pendingFriends?.length ||
          0 > 0 ? (
          currSellector == "unread" ? (
            <div>Unread</div>
          ) : currSellector == "groups" ? (
            <div>Groups</div>
          ) : currSellector == "pending" ? (
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              {chatsInfo?.pendingFriends?.length > 0 ? (
                chatsInfo.pendingFriends.map((val, idx) => {
                  return <ChatRow friendInfo={val} key={idx} type="pending" />;
                })
              ) : (
                <div className="flex flex-col flex-grow pt-16">
                  <div className="min-h-[100px] w-full h-1/6 text-center mb-4">
                    <img
                      className="h-inherit min-w-[100px] w-1/4 mx-[37.5%]"
                      src="https://png.pngtree.com/png-clipart/20230810/original/pngtree-happy-emoji-emoticon-showing-double-thumbs-up-like-picture-image_7851906.png"
                    />
                  </div>
                  <div className="sm:text-2xl md:text-3xl lg:text-4xl font-semibold italic text-center">
                    Hooray!! No Pending Requests
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              {chatsInfo?.friendList?.length > 0
                ? chatsInfo.friendList.map((val, idx) => {
                    return (
                      <ChatRow
                        onClickFunc={() => {
                          dispatch(setCurrChatRow(val));
                          setIsChatClicked(0);

                          getNotificationCount(val.messages) > 0 &&
                            chatRowNotificationSeen(val.roomId);
                        }}
                        friendInfo={val}
                        notificationCount={getNotificationCount(val.messages)}
                        key={idx}
                      />
                    );
                  })
                : null}
              {chatsInfo?.groupsList?.length > 0
                ? chatsInfo.groupsList.map((val, idx) => {
                    return <ChatRow friendInfo={val} key={idx} />;
                  })
                : null}
              {chatsInfo?.pendingFriends?.length > 0
                ? chatsInfo.pendingFriends.map((val, idx) => {
                    return (
                      <ChatRow friendInfo={val} key={idx} type="pending" />
                    );
                  })
                : null}
            </div>
          )
        ) : (
          <div className="flex-grow">
            <img className="h-full w-full" src={getStarted} />
          </div>
        )}
      </div>

      <div className="flex flex-col w-[70%] min-w-[400px] h-full bg-[#f3f2ed] rounded-lg rounded-l-none">
        {isChatClicked == -1 ? (
          <div className="h-full w-full">
            <img
              className="h-full w-full object-cover opacity-75"
              src={
                "https://static.vecteezy.com/system/resources/previews/023/122/653/non_2x/3d-lets-talk-banner-concept-cartoon-style-vector.jpg"
              }
            />
          </div>
        ) : (
          <ChatWindow userInfo={currChatRow} />
        )}
      </div>
    </Root>
  );
};

const Root = styled.div`
  ::-webkit-scrollbar {
    width: 0.5em;
  }
  ::-webkit-scrollbar-track {
    background: white;
  }
  ::-webkit-scrollbar-thumb {
    background: #e7717d;

    border-radius: 100vw;
  }
`;

export default ChatingArea;
