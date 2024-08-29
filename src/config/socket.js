import { io } from "socket.io-client";
import { getToken } from "../helper/helperFunctions";

const SERVER_URL = "http://localhost:4000";
const socket = io(SERVER_URL, {
  auth: {
    token: getToken(),
  },
});

export default socket;
