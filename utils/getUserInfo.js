import axios from "axios";
import baseUrl from "./baseUrl";
import cookie from "js-cookie";

const getUserInfo = async userToFindId => {
  try {
    const res = await axios.get(`${baseUrl}/api/chats/user/${userToFindId}`, {
      headers: { Authorization: cookie.get("token") }
    });

    return { name: res.data.name, profilePicUrl: res.data.profilePicUrl };
  } catch (error) {
    console.error(error);
  }
};

export default getUserInfo;
