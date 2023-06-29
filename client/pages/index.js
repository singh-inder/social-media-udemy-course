import { useEffect, useState, useCallback } from "react";
import CreatePost from "../components/Post/CreatePost";
import CardPost from "../components/Post/CardPost";
import { Segment } from "semantic-ui-react";
import { NoPosts } from "../components/Layout/NoData";
import InfiniteScroll from "react-infinite-scroll-component";
import { PlaceHolderPosts, EndMessage } from "../components/Layout/PlaceHolderGroup";

import { Axios as PostsAxiosInstance } from "../utils/postActions";
import Spinner from "@/components/Layout/Spinner";
import useApiRequest from "@/components/hooks/useApiRequest";

function Index({ user }) {
  const fetchPosts = useCallback(async () => {
    return PostsAxiosInstance.get("/", {
      params: { pageNumber: 1 }
    });
  }, []);

  const {
    data: posts,
    setData: setPosts,
    error,
    loading
  } = useApiRequest([], fetchPosts);

  const [hasMore, setHasMore] = useState(true);

  const [pageNumber, setPageNumber] = useState(2);

  const fetchDataOnScroll = useCallback(async () => {
    try {
      const res = await PostsAxiosInstance.get("/", { params: { pageNumber } });

      if (res.data.length === 0) setHasMore(false);

      setPosts(prev => [...prev, ...res.data]);
      setPageNumber(prev => prev + 1);
    } catch (error) {
      alert("Error fetching Posts");
    }
  }, [pageNumber, setPosts]);

  useEffect(() => {
    document.title = `Welcome, ${user.name.split(" ")[0]}`;
  }, [user]);

  return (
    <Segment>
      <CreatePost user={user} setPosts={setPosts} />

      {loading ? (
        <Spinner />
      ) : error ? (
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
            <CardPost key={post._id} post={post} user={user} setPosts={setPosts} />
          ))}
        </InfiniteScroll>
      )}
    </Segment>
  );
}

export default Index;
