import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useDebounce } from "usehooks-ts";
import { Search } from "semantic-ui-react";
import axios from "axios";
import cookie from "js-cookie";
import ResultRenderer from "./SearchResultRenderer";
import baseUrl from "../../utils/baseUrl";

function SearchComponent() {
  const router = useRouter();
  const [text, setText] = useState("");
  const debouncedText = useDebounce(text, 500);
  const controllerRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (text.length === 0 && loading) setLoading(false);
  }, [text, loading]);

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

        const mappedResults = res.data.map(result => ({
          title: result.name,
          username: result.username,
          image: result.profilePicUrl
        }));

        setResults(mappedResults);
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    })();
  }, [debouncedText]);

  return (
    <Search
      onBlur={() => {
        loading && setLoading(false);
        setText("");
      }}
      loading={loading}
      value={text}
      resultRenderer={ResultRenderer}
      results={results}
      onSearchChange={(e, { value }) => {
        setText(value);
        const noValue = value.length === 0 || value.trim().length === 0;

        if (noValue) return setResults([]);
      }}
      minCharacters={1}
      onResultSelect={(e, data) => router.push(`/${data.result.username}`)}
    />
  );
}

export default SearchComponent;
