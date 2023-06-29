import axios from "axios";
import cookie from "js-cookie";
import baseUrl from "@/utils/baseUrl";

const headers = { Authorization: cookie.get("token") };

/** baseUrl =`${baseUrl}/api/chats` */
const ChatsAxiosInstance = axios.create({ baseURL: `${baseUrl}/api/chats`, headers });

export default ChatsAxiosInstance;
