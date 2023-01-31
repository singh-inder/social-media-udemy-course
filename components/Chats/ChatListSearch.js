import { useState, useEffect, useCallback } from "react";
import { List, Search } from "semantic-ui-react";
import axios from "axios";
import cookie from "js-cookie";
import { useRouter } from "next/router";
import Avatar from "../Post/Avatar";
import baseUrl from "../../utils/baseUrl";
let cancel;

function ChatListSearch({ chats, setChats }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [renderResults, setRenderResults] = useState([]);
  const [searchTimer, setSearchTimer] = useState(null);
  const router = useRouter();
  const push = url => router.push(url, undefined, { shallow: true });

  const handleChange = async value => {
    setLoading(true);

    try {
      cancel && cancel();
      const CancelToken = axios.CancelToken;
      const token = cookie.get("token");

      const res = await axios.get(`${baseUrl}/api/search/${value}`, {
        headers: { Authorization: token },
        cancelToken: new CancelToken(canceler => {
          cancel = canceler;
        })
      });

      if (res.data.length === 0) {
        results.length > 0 && setResults([]);

        return setLoading(false);
      }

      setResults(res.data);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  // prettier-ignore
  const addChat = useCallback(result => {
    const alreadyInChat = chats?.some(chat => chat.messagesWith === result._id);

    if (alreadyInChat) return push(`/messages?message=${result._id}`);

    const newChat = {
      messagesWith: result._id,
      name: result.name,
      profilePicUrl: result.profilePicUrl,
      lastMessage: "",
      date: Date.now()
    };

    setChats(prev => [newChat, ...prev]);

    return push(`/messages?message=${result._id}`);
  }, [push, chats]);

  useEffect(() => {
    if (text.length === 0 && loading) setLoading(false);
  }, [text]);

  useEffect(() => {
    if (results.length === 0) return setRenderResults([]);
    setRenderResults(
      results.map((result, index) => ({
        image: result.profilePicUrl,
        title: result.name,
        index
      }))
    );
  }, [results]);

  return (
    <Search
      loading={loading}
      value={text}
      resultRenderer={ResultRenderer}
      results={renderResults}
      onSearchChange={e => {
        const { value } = e.target;
        setText(value);
        if (searchTimer) clearTimeout(searchTimer);
        if (value.length === 0 || value.trim().length === 0) return setResults([]);

        setLoading(true);
        setSearchTimer(
          setTimeout(() => {
            handleChange(value);
          }, 2000)
        );
      }}
      minCharacters={1}
      onResultSelect={(e, data) => addChat(results[data.result.index])}
    />
  );
}

const ResultRenderer = ({ image, title }) => {
  return (
    <List>
      <List.Item
        className="relative flex items-center"
        style={{ marginBottom: "5px", marginTop: "5px" }}
      >
        <List.Content header={title} />

        <Avatar
          styles={{ position: "absolute", right: "10px" }}
          src={image}
          alt={title}
        />
      </List.Item>
    </List>
  );
};

export default ChatListSearch;
