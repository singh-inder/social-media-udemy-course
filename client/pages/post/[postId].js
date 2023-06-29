/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, Icon, Divider, Segment, Container } from "semantic-ui-react";
import { useRouter } from "next/router";
import Link from "next/link";

import PostComments from "@/components/Post/PostComments";
import CommentInputField from "@/components/Post/CommentInputField";
import Avatar from "@/components/Post/Avatar";
import LikesList from "@/components/Post/LikesList";
import { Axios, likePost } from "@/utils/postActions";
import calculateTime from "@/utils/calculateTime";
import { NoPostFound } from "@/components/Layout/NoData";
import useApiRequest from "@/components/hooks/useApiRequest";
import Spinner from "@/components/Layout/Spinner";

function PostPage({ user }) {
  const router = useRouter();

  const fetchPost = useCallback(() => {
    return Axios.get(`/${router.query.postId}`);
  }, [router.query]);

  const { data: post, loading, error } = useApiRequest(null, fetchPost);

  const [likes, setLikes] = useState([]);

  const [comments, setComments] = useState([]);

  const isLiked = useMemo(() => {
    return likes.some(like => like.user === user._id);
  }, [likes, user._id]);

  useEffect(() => {
    if (!post) return;

    if (post.likes) setLikes(post.likes);
    if (post.comments) setComments(post.comments);
  }, [post]);

  return (
    <Container text>
      <Segment basic>
        {loading ? (
          <Spinner />
        ) : error || !post ? (
          <NoPostFound />
        ) : (
          <Card color="teal" fluid>
            {post?.picUrl && (
              <img
                loading="lazy"
                src={post.picUrl}
                style={{ cursor: "pointer" }}
                alt="PostImage"
              />
            )}

            <Card.Content className="relative">
              <div className="flex" style={{ gap: "1rem" }}>
                <Avatar alt={post.user.name} src={post.user.profilePicUrl} />

                <div>
                  <h4 style={{ marginBottom: "2px" }}>
                    <Link href={`/${post.user.username}`}>{post.user.name}</Link>
                  </h4>
                  <Card.Meta>{calculateTime(post.createdAt)}</Card.Meta>

                  {post.location && <Card.Meta content={post.location} />}
                </div>
              </div>

              <Card.Description className="cardDescription">
                {post.text}
              </Card.Description>
            </Card.Content>

            <Card.Content extra>
              <Icon
                name={isLiked ? "heart" : "heart outline"}
                color="red"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  likePost(post._id, user._id, setLikes, isLiked ? false : true)
                }
              />

              <LikesList
                postId={post._id}
                trigger={
                  likes.length > 0 && (
                    <span className="spanLikesList">
                      {`${likes.length} ${likes.length === 1 ? "like" : "likes"}`}
                    </span>
                  )
                }
              />

              <Icon
                name="comment outline"
                style={{ marginLeft: "7px" }}
                color="blue"
              />

              {comments.map(comment => (
                <PostComments
                  key={comment._id}
                  comment={comment}
                  postId={post._id}
                  user={user}
                  setComments={setComments}
                />
              ))}

              <Divider hidden />

              <CommentInputField
                user={user}
                postId={post._id}
                setComments={setComments}
              />
            </Card.Content>
          </Card>
        )}
      </Segment>
      <Divider hidden />
    </Container>
  );
}

export default PostPage;
