import { useCallback, useEffect, useRef, useState } from "react";
import MessagesAxiosInstance from "./MessagesAxiosInstance";
import Banner from "./Banner";
import Message from "./Message";
import MessageInputField from "./MessageInputField";
import Spinner from "@/components/Layout/Spinner";
import socket from "@/service/socket";
import getUserInfo from "@/utils/getUserInfo";
import newMsgSound from "@/utils/newMsgSound";

function MessagesDiv({ user, openChatId, chats, setChats }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [bannerData, setBannerData] = useState({ name: "", profilePicUrl: "" });
  /**@type {React.MutableRefObject<HTMLDivElement>} */
  const divRef = useRef();

  // Use this ref in useEffect hook with chats in dependency list
  const chatsRef = useRef(chats || []);

  // prettier-ignore
  const sendMsg = useCallback(msg => {
    socket?.emit("sendNewMsg", {
      userId: user._id,
      msgSendToUserId: openChatId,
      msg
    });
  }, [user, openChatId]);

  // prettier-ignore
  const deleteMsg = useCallback(async messageId => {
    const params = { messagesWith: openChatId, messageId };

    try {
      await MessagesAxiosInstance.delete("/", { params });
      setMessages(prev => prev.filter(message => message._id !== messageId));
    } catch (error) {
      console.log(error);
    }
  }, [openChatId]);

  useEffect(() => {
    if (messages.length > 0) divRef.current.scrollIntoView(false);
  }, [messages]);

  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  // LOAD MESSAGES WHEN openChatId changes
  useEffect(() => {
    if (!openChatId) return;

    (async () => {
      setLoading(true);

      try {
        const chats = chatsRef.current;
        const inListIndex = chats.findIndex(chat => chat.messagesWith === openChatId);

        if (inListIndex !== -1) {
          const { name, profilePicUrl } = chats[inListIndex];
          setBannerData({ name, profilePicUrl });
        }

        const withUserInfo = inListIndex === -1;

        const res = await MessagesAxiosInstance.get("/", {
          params: { userId: user._id, messagesWith: openChatId, withUserInfo }
        });

        setMessages(res.data.messages);

        if (withUserInfo) {
          setBannerData({
            name: res.data.name,
            profilePicUrl: res.data.profilePicUrl
          });

          const newChat = {
            messagesWith: openChatId,
            name: res.data.name,
            profilePicUrl: res.data.profilePicUrl,
            lastMessage: "",
            date: new Date()
          };
          setChats(prev => [newChat, ...prev]);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    })();
  }, [openChatId, user, setChats]);

  // prettier-ignore
  const msgSent = useCallback(({ newMsg }) => {
    const receiver = newMsg.receiver;

    setChats(prev => {
      const updateIndex = prev.findIndex(chat => chat.messagesWith === receiver);
      if (updateIndex === -1) return prev;

      prev[updateIndex].lastMessage = newMsg.msg;
      prev[updateIndex].date = newMsg.date;

      return [...prev];
    });

    if (receiver !== openChatId) return;
    setMessages(prev => [...prev, newMsg]);
  }, [openChatId, setChats]);

  // prettier-ignore
  const newMsgReceived = useCallback(async ({ newMsg }) => {
    let senderName;

    const prevChatIndex = chats.findIndex(chat => chat.messagesWith === newMsg.sender);

    // WHEN CHAT WITH SENDER IS CURRENTLY OPENED INSIDE YOUR BROWSER
    if (newMsg.sender === openChatId) {
      setMessages(prev => [...prev, newMsg]);

      if (prevChatIndex === -1) return;

      const updatedChat = {
        ...chats[prevChatIndex],
        lastMessage: newMsg.msg,
        date: newMsg.date
      };

      const chatsCopy = chats;
      chatsCopy.splice(prevChatIndex, 1);
      setChats([updatedChat, ...chatsCopy]);
    }
    // IF INDEX !== -1, that means chat is present in ChatList
    else if (prevChatIndex !== -1) {
      const newChat = {
        ...chats[prevChatIndex],
        lastMessage: newMsg.msg,
        date: newMsg.date
      };
      senderName = newChat.name;

      const chatsCopy = chats;
      chatsCopy.splice(prevChatIndex, 1);
      setChats([newChat, ...chatsCopy]);
    }
    // CREATE NEW CHAT TO BE ADDED IN CHATLIST
    else {
      const { name, profilePicUrl } = await getUserInfo(newMsg.sender);
      senderName = name;

      const newChat = {
        messagesWith: newMsg.sender,
        name,
        profilePicUrl,
        lastMessage: newMsg.msg,
        date: newMsg.date
      };

      setChats(prev => [newChat, ...prev]);
    }

    newMsgSound(senderName);
  }, [openChatId, setChats, chats]);

  useEffect(() => {
    if (!socket) return;
    const evts = [
      { name: "msgSent", cb: msgSent },
      { name: "newMsgReceived", cb: newMsgReceived }
    ];

    evts.forEach(({ name, cb }) => socket.on(name, cb));

    return () => {
      evts.forEach(({ name, cb }) => socket.off(name, cb));
    };
  }, [msgSent, newMsgReceived]);

  if (!openChatId) return null;

  return (
    <>
      <div
        style={{
          overflow: "auto",
          overflowX: "hidden",
          maxHeight: "35rem",
          height: "35rem",
          backgroundColor: "whitesmoke"
        }}
        ref={divRef}
      >
        <Banner bannerData={bannerData} />

        {loading ? (
          <Spinner />
        ) : (
          messages.map(message => (
            <Message
              key={message._id}
              bannerProfilePic={bannerData.profilePicUrl}
              message={message}
              user={user}
              deleteMsg={deleteMsg}
            />
          ))
        )}
      </div>

      <MessageInputField disabled={loading} sendMsg={sendMsg} />
    </>
  );
}

export default MessagesDiv;
