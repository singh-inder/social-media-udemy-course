import { useState } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import { Card, Icon, Divider, Segment, Container } from "semantic-ui-react";
import PostComments from "../../components/Post/PostComments";
import CommentInputField from "../../components/Post/CommentInputField";
import Avatar from "../../components/Post/Avatar";
import LikesList from "../../components/Post/LikesList";
import Link from "next/link";
import { likePost } from "../../utils/postActions";
import calculateTime from "../../utils/calculateTime";
import baseUrl from "../../utils/baseUrl";
import { NoPostFound } from "../../components/Layout/NoData";

function PostPage({ post, errorLoading, user }) {
  const [likes, setLikes] = useState(post.likes);

  const isLiked = likes.some(like => like.user === user._id);

  const [comments, setComments] = useState(post.comments);

  if (errorLoading) return <NoPostFound />;

  return (
    <Container text>
      <Segment basic>
        <Card color="teal" fluid>
          {post.picUrl && (
            <img
              loading="lazy"
              src={post.picUrl}
              style={{ cursor: "pointer" }}
              alt="PostImage"
              onClick={() => setShowModal(true)}
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

            <Icon name="comment outline" style={{ marginLeft: "7px" }} color="blue" />

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
      </Segment>
      <Divider hidden />
    </Container>
  );
}

export const getServerSideProps = async ctx => {
  try {
    const { postId } = ctx.query;
    const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/posts/${postId}`, {
      headers: { Authorization: token }
    });

    return { props: { post: res.data } };
  } catch (error) {
    return { props: { errorLoading: true } };
  }
};

export default PostPage;
