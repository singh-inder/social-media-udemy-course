import { useState, useEffect, useCallback, useRef } from "react";
import { useDebounce } from "usehooks-ts";
import { Search } from "semantic-ui-react";
import axios from "axios";
import cookie from "js-cookie";
import ResultRenderer from "../Layout/SearchResultRenderer";
import baseUrl from "../../utils/baseUrl";

function ChatListSearch({ chats, setChats, setOpenChatId }) {
  const [text, setText] = useState("");
  const debouncedText = useDebounce(text, 500);
  const controllerRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [renderResults, setRenderResults] = useState([]);

  useEffect(() => {
    if (debouncedText.length === 0) return;
    (async () => {
      setLoading(true);

      try {
        const value = debouncedText;

        if (controllerRef.current) controllerRef.current.abort();
        controllerRef.current = new AbortController();
        const token = cookie.get("token");

        const res = await axios.get(`${baseUrl}/api/search/${value}`, {
          headers: { Authorization: token },
          signal: controllerRef.current.signal
        });

        setResults(res.data);
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    })();
  }, [debouncedText]);

  // prettier-ignore
  const addChat = useCallback(result => {
    const alreadyInChat = chats?.some(chat => chat.messagesWith === result._id);

    if (!alreadyInChat) {
      const newChat = {
        messagesWith: result._id,
        name: result.name,
        profilePicUrl: result.profilePicUrl,
        lastMessage: "",
        date: Date.now()
      };

      setChats(prev => [newChat, ...prev]);
    }

    setOpenChatId(result._id);
  }, [chats, setChats, setOpenChatId]);

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

  useEffect(() => {
    if (text.length === 0 && loading) setLoading(false);
  }, [text, loading]);

  return (
    <Search
      loading={loading}
      value={text}
      resultRenderer={ResultRenderer}
      results={renderResults}
      onSearchChange={(e, { value }) => {
        setText(value);
        const noValue = value.length === 0 || value.trim().length === 0;

        if (noValue) return setResults([]);
      }}
      minCharacters={1}
      onResultSelect={(e, data) => addChat(results[data.result.index])}
    />
  );
}

export default ChatListSearch;
