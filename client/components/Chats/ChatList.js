import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Comment, Segment } from "semantic-ui-react";

import Chat from "./Chat";
import socket from "@/service/socket";
import ChatsAxiosInstance from "./ChatsAxiosInstance";

function ChatList({ chats, setChats, openChatId, setOpenChatId }) {
  const router = useRouter();
  const [connectedUsers, setConnectedUsers] = useState({});
  const connectedInterval = useRef(null);

  // prettier-ignore
  const deleteChat = useCallback(async messagesWith => {
    try {
      await ChatsAxiosInstance.delete(`/${messagesWith}`);

      setChats(prev => prev.filter(chat => chat.messagesWith !== messagesWith));
      setOpenChatId("");
      router.replace("/messages", {}, { shallow: true });
    } catch (error) {
      alert("Error deleting chat");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setChats, setOpenChatId]);

  // => CHECK ONLINE USERS
  useEffect(() => {
    const onlineStatusChecked = ({ onlineUsers }) => setConnectedUsers(onlineUsers);

    socket.on("onlineStatusChecked", onlineStatusChecked);

    return () => {
      socket.off("onlineStatusChecked", onlineStatusChecked);
    };
  }, []);

  useEffect(() => {
    if (connectedInterval.current) clearInterval(connectedInterval.current);
    if (chats.length === 0) return;
    const checkOnlineStatus = () => {
      console.log("interval", chats.length);
      // CAN BE DONE IN BATCHES WHEN SCALING THE APP
      const users = chats.map(chat => chat.messagesWith);

      socket.emit("checkOnlineStatus", { users });
    };

    checkOnlineStatus();
    connectedInterval.current = setInterval(checkOnlineStatus, 10 * 1000);

    return () => {
      if (connectedInterval.current) clearInterval(connectedInterval.current);
    };
  }, [chats]);

  if (!chats || chats.length === 0) return null;

  return (
    <Comment.Group size="big">
      <Segment raised style={{ overflow: "auto", maxHeight: "32rem" }}>
        {chats.map(chat => (
          <Chat
            key={chat.messagesWith}
            chat={chat}
            openChatId={openChatId}
            setOpenChatId={setOpenChatId}
            isOnline={connectedUsers[chat.messagesWith]}
            deleteChat={deleteChat}
          />
        ))}
      </Segment>
    </Comment.Group>
  );
}

export default ChatList;
