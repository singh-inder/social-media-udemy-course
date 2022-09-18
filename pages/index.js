import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import CreatePost from "../components/Post/CreatePost";
import CardPost from "../components/Post/CardPost";
import { Segment } from "semantic-ui-react";
import { parseCookies } from "nookies";
import { NoPosts } from "../components/Layout/NoData";
import InfiniteScroll from "react-infinite-scroll-component";
import { PlaceHolderPosts, EndMessage } from "../components/Layout/PlaceHolderGroup";

import SocketHoc from "../components/SocketHoc";
import { Axios } from "../utils/postActions";

function Index({ user, postsData, errorLoading }) {
  const [posts, setPosts] = useState(postsData || []);
  const [hasMore, setHasMore] = useState(true);

  const [pageNumber, setPageNumber] = useState(2);

  const socket = useRef();

  useEffect(() => {
    document.title = `Welcome, ${user.name.split(" ")[0]}`;
  }, []);

  const fetchDataOnScroll = async () => {
    try {
      const res = await Axios.get("/", { params: { pageNumber } });

      if (res.data.length === 0) setHasMore(false);

      setPosts(prev => [...prev, ...res.data]);
      setPageNumber(prev => prev + 1);
    } catch (error) {
      alert("Error fetching Posts");
    }
  };

  return (
    <SocketHoc user={user} socket={socket}>
      <Segment>
        <CreatePost user={user} setPosts={setPosts} />

        {posts.length === 0 || errorLoading ? (
          <NoPosts />
        ) : (
          <InfiniteScroll
            hasMore={hasMore}
            next={fetchDataOnScroll}
            loader={<PlaceHolderPosts />}
            endMessage={<EndMessage />}
            dataLength={posts.length}
          >
            {posts.map(post => (
              <CardPost
                socket={socket}
                key={post._id}
                post={post}
                user={user}
                setPosts={setPosts}
              />
            ))}
          </InfiniteScroll>
        )}
      </Segment>
    </SocketHoc>
  );
}

export const getServerSideProps = async ctx => {
  try {
    const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/posts`, {
      headers: { Authorization: token },
      params: { pageNumber: 1 }
    });

    return { props: { postsData: res.data } };
  } catch (error) {
    return { props: { errorLoading: true } };
  }
};

export default Index;
