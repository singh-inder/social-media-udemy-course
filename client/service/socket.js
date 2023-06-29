import { io } from "socket.io-client";
import baseUrl from "@/utils/baseUrl";
import cookie from "js-cookie";

const socket = io(baseUrl, {
  extraHeaders: {
    authorization: cookie.get("token")
  }
});

export default socket;
