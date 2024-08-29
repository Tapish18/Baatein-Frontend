import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SiPinboard } from "react-icons/si";
import { getToken } from "../../helper/helperFunctions";
import { useDispatch } from "react-redux";
import { changeEditStatus, updateProfileInfo } from "../../slices/userSlice";
import { useNavigate } from "react-router-dom";
import uploadProfilePicture from "../../config/firebase";
import { getAuthHeader } from "../../helper/helperFunctions";
const Profile = () => {
  const user = useSelector((store) => store.user.userInfo);
  const dispatch = useDispatch();
  const [currImage, setCurrImage] = useState(
    user?.profileInfo?.profilePhoto || ""
  );
  const [file, setFile] = useState("");
  const [username, setUsername] = useState(user?.profileInfo?.username || "");
  const [status, setStatus] = useState(user?.profileInfo?.status || "");
  const [about, setAbout] = useState(user?.profileInfo?.about || "");
  const navigate = useNavigate();

  function handlePictureBtnClick() {
    const inputBtn = document.getElementById("imgInput");
    inputBtn.click();
  }

  function handleInputChange(e) {
    setFile(e.target.files[0]);
    // uploadProfilePicture(e.target.files[0], user._id);
    const objectURL = URL.createObjectURL(e.target.files[0]);
    setCurrImage(objectURL);
    // console.log(objectURL);
  }

  async function updateProfileAction(url) {
    let formData = {
      username,
      about,
      status,
    };
    if (url != "") {
      formData["profilePhoto"] = url;
    }
    console.log(formData);

    const data = await fetch(
      process.env.REACT_APP_BASE_URL + "/updateProfile",
      {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(formData),
      }
    );

    const json = await data.json();
    dispatch(updateProfileInfo({ profileInfo: formData }));
    console.log(json);
  }

  async function handleFinalSubmit() {
    if (file != "") {
      const url = await uploadProfilePicture(file, user._id);
      updateProfileAction(url);
      dispatch(changeEditStatus());
      navigate("/chats");
    } else {
      if (currImage == "") {
        alert("Upload Profile Picture");
      } else {
        updateProfileAction("");
        dispatch(changeEditStatus());
        navigate("/chats");
      }
    }
  }

  return (
    <div className="flex flex-col justify-around w-full h-full p-2">
      <div className="flex flex-row justify-around w-full min-h-[300px] h-1/5]">
        <div className="flex flex-col h-full mt-6">
          <img
            src={
              currImage == ""
                ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSppkoKsaYMuIoNLDH7O8ePOacLPG1mKXtEng&s"
                : currImage
            }
            type="file"
            className="h-[200px] w-[200px] bg-blue-300 rounded-md"
          />
          <input
            type="file"
            id="imgInput"
            onChange={(e) => {
              handleInputChange(e);
            }}
            accept="image/*"
            hidden={true}
          />
          <button
            onClick={() => {
              handlePictureBtnClick();
            }}
            className="mt-1 p-2 bg-slate-600 rounded-md text-white font-bold"
          >
            Upload Picture
          </button>
        </div>
        <div className="relative flex flex-col min-w-[300px] w-2/5 border-2 bg-yellow-300">
          <SiPinboard className="text-red-700 h-[40px] w-[40px]  m-2" />
          <div className="flex flex-col flex-grow items-center">
            <div className="my-2 p-1 flex text-center">
              <div className="font-bold text-lg mx-2 min-w-[100px]">
                <label htmlFor="usernameInput">Username</label>
              </div>

              <input
                id="usernameInput"
                className="outline-none border-b-2 border-black pl-2 bg-inherit "
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>
            <div className="my-2 p-1 flex text-center">
              <div className="font-bold text-lg mx-2 min-w-[100px]">
                <label htmlFor="aboutInput">About</label>
              </div>

              <input
                id="aboutInput"
                className="outline-none border-b-2 border-black pl-2 bg-inherit"
                type="text"
                value={about}
                onChange={(e) => {
                  setAbout(e.target.value);
                }}
              />
            </div>
            <div className="my-2 p-1 flex text-center">
              <div className="font-bold text-lg mx-2 min-w-[100px]">
                <label htmlFor="statusInput">Status</label>
              </div>
              <input
                id="statusInput"
                className="outline-none border-b-2 border-black pl-2 bg-inherit"
                type="text"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full text-center">
        <button
          type="submit"
          className="p-2 w-1/4 text-lg bg-green-400 text-white rounded-lg font-semibold"
          onClick={() => {
            handleFinalSubmit();
          }}
        >
          Save and Continue
        </button>
      </div>
    </div>
  );
};

export default Profile;
