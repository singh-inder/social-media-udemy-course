import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Segment, Grid, Icon } from "semantic-ui-react";
import { useRouter } from "next/router";

import MessagesDiv from "@/components/Messages/MessagesDiv";
import ChatList from "@/components/Chats/ChatList";
import ChatListSearch from "@/components/Chats/ChatListSearch";
import { NoMessages } from "@/components/Layout/NoData";

import getParams from "@/utils/getParams";
import ChatsAxiosInstance from "@/components/Chats/ChatsAxiosInstance";
import useApiRequest from "@/components/hooks/useApiRequest";
import Spinner from "@/components/Layout/Spinner";

const setMessageToRead = () => ChatsAxiosInstance.post("/");

function MessagesPage({ user }) {
  const router = useRouter();

  const fetchChats = useCallback(() => ChatsAxiosInstance.get("/"), []);
  const { data: chats, setData: setChats, loading } = useApiRequest([], fetchChats);

  const [openChatId, setOpenChatId] = useState("");

  // ON MOUNT OPEN CHAT
  useEffect(() => {
    let chatId = getParams("message");
    if (chatId) setOpenChatId(chatId);
  }, []);

  useEffect(() => {
    if (user.unreadMessage) setMessageToRead();
  }, [user]);

  useEffect(() => {
    if (!openChatId) return;
    router.replace(`/messages?message=${openChatId}`, undefined, { shallow: true });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openChatId]);

  return (
    <Segment padded basic size="large" style={{ marginTop: "5px" }}>
      <Link href="/" style={{ marginBottom: "10px" }}>
        <Icon name="arrow circle left" size="big" />
      </Link>

      <div style={{ margin: "10px 0" }}>
        <ChatListSearch
          chats={chats}
          setChats={setChats}
          setOpenChatId={setOpenChatId}
        />
      </div>

      <Grid stackable>
        <Grid.Column width={4}>
          <ChatList
            chats={chats}
            setChats={setChats}
            openChatId={openChatId}
            setOpenChatId={setOpenChatId}
          />
        </Grid.Column>

        <Grid.Column width={12}>
          <MessagesDiv
            user={user}
            openChatId={openChatId}
            chats={chats}
            setChats={setChats}
          />
        </Grid.Column>
      </Grid>

      {loading ? <Spinner /> : chats.length === 0 && <NoMessages />}
    </Segment>
  );
}

export default MessagesPage;
