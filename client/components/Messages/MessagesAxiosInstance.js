import axios from "axios";
import cookie from "js-cookie";
import baseUrl from "@/utils/baseUrl";

const headers = { Authorization: cookie.get("token") };

/** baseUrl= `${baseUrl}/api/messages` */
const MessagesAxiosInstance = axios.create({
  baseURL: `${baseUrl}/api/messages`,
  headers
});

export default MessagesAxiosInstance;
