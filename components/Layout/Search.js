import React, { useEffect, useState } from "react";
import { List, Image, Search } from "semantic-ui-react";
import axios from "axios";
import cookie from "js-cookie";
import Router from "next/router";
import baseUrl from "../../utils/baseUrl";
let controller = null;

function SearchComponent() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searchTimer, setSearchTimer] = useState(null);

  const handleChange = async value => {
    try {
      if (controller) controller.abort();
      controller = new AbortController();
      const token = cookie.get("token");

      const res = await axios.get(`${baseUrl}/api/search/${value}`, {
        headers: { Authorization: token },
        signal: controller.signal
      });

      if (res.data.length === 0) {
        results.length > 0 && setResults([]);

        return setLoading(false);
      }
      const mappedResults = res.data.map(result => ({
        title: result.name,
        username: result.username,
        image: result.profilePicUrl
      }));

      setResults(mappedResults);
    } catch (error) {
      console.log(error);
    }
    controller = null;
    setLoading(false);
  };

  useEffect(() => {
    if (text.length === 0 && loading) setLoading(false);
  }, [text]);

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
      onSearchChange={e => {
        if (searchTimer) clearTimeout(searchTimer);
        const { value } = e.target;
        setText(value);
        const noValue = value.length === 0 || value.trim().length === 0;
        if (noValue) return;

        setLoading(true);
        setSearchTimer(
          setTimeout(() => {
            handleChange(value);
          }, 2000)
        );
      }}
      minCharacters={1}
      onResultSelect={(e, data) => Router.push(`/${data.result.username}`)}
    />
  );
}

const ResultRenderer = ({ title, image }) => {
  return (
    <List>
      <List.Item>
        <Image src={image} alt="ProfilePic" avatar />
        <List.Content header={title} as="a" />
      </List.Item>
    </List>
  );
};

export default SearchComponent;
