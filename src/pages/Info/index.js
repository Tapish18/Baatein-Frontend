import React from "react";
import { useState, useEffect } from "react";
import { removeToken, getToken } from "../../helper/helperFunctions";
import { useNavigate } from "react-router-dom";
import { getAuthHeader } from "../../helper/helperFunctions";
import { useDispatch } from "react-redux";
import {
  changeEditStatus,
  resetUserState,
  updateUserInfo,
} from "../../slices/userSlice";
import Profile from "./Profile";
import Settings from "./Settings";
import ActivityLog from "./ActivityLog";
import ConnectedDevices from "./ConnectedDevices";
import { useSelector } from "react-redux";
const Info = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Profile");
  const isEdit = useSelector((store) => store.user.userInfo.isEdit);

  const getUserInfo = async () => {
    try {
    } catch (error) {}
    if (getToken()) {
      const data = await fetch(
        process.env.REACT_APP_BASE_URL + "/getUserInfo",
        {
          method: "GET",
          headers: getAuthHeader(),
        }
      );
      const json = await data.json();
      dispatch(updateUserInfo(json));
      if (json.userInfo.isProfileSetup == true) {
        console.log("something ==>", json.userInfo.isProfileSetup);
        if (!isEdit) {
          navigate("/chats");
        }
        // const res = dispatch(
        //   checkChatsToInfo((e) => console.log("e ====>", e))
        // );
        // navigate("/chats");
      }
    } else {
      console.log("called");
      navigate("/");
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className="flex h-full w-full bg-white mb-10 rounded-lg">
      <div className="flex flex-col w-[20%] h-full bg-slate-100 rounded-l-lg min-w-[150px] p-2">
        <div
          onClick={() => {
            dispatch(changeEditStatus());
            navigate("/chats");
          }}
          className="italic font-bold text-3xl text-slate-400 w-full text-center mb-4 cursor-pointer hover:text-purple-500"
        >
          Go To Chats
        </div>
        <div className="flex flex-col justify-between border-t-2 border-black p-1 text-lg font-semibold text-center pt-10">
          <div
            className="p-3 border-b-2 hover:bg-white cursor-pointer"
            onClick={() => setActiveTab("Profile")}
          >
            Profile
          </div>
          <div
            className="p-3 border-b-2 hover:bg-white cursor-pointer"
            onClick={() => setActiveTab("Activity Log")}
          >
            Activity log
          </div>
          <div
            className="p-3 border-b-2 hover:bg-white cursor-pointer"
            onClick={() => setActiveTab("Settings")}
          >
            Settings
          </div>
          <div
            className="p-3 border-b-2 hover:bg-white cursor-pointer"
            onClick={() => setActiveTab("Connected Devices")}
          >
            Connected Devices
          </div>
          <div
            className="p-3 hover:bg-white cursor-pointer"
            onClick={() => {
              removeToken();
              dispatch(resetUserState());
              navigate("/");
            }}
          >
            Logout
          </div>
        </div>
      </div>
      <div className="flex flex-col w-[80%] h-full p-2 justify-between min-w-[600px]">
        <div className="w-full h-10 bg-[#c2b9b0] rounded-lg text-white text-2xl p-1 px-4 font-bold">
          {activeTab}
        </div>
        <div className="w-full h-full mt-3">
          {activeTab == "Profile" ? (
            <Profile />
          ) : activeTab == "Settings" ? (
            <Settings />
          ) : activeTab == "Connected Devices" ? (
            <ConnectedDevices />
          ) : activeTab == "Activity Log" ? (
            <ActivityLog />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Info;
