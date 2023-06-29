import React from "react";
import { Modal, Grid, Card, Icon, Divider } from "semantic-ui-react";
import PostComments from "./PostComments";
import CommentInputField from "./CommentInputField";
import Avatar from "./Avatar";
import calculateTime from "../../utils/calculateTime";
import Link from "next/link";
import { likePost } from "../../utils/postActions";
import LikesList from "./LikesList";

function ImageModal({
  post,
  user,
  setLikes,
  likes,
  isLiked,
  comments = [],
  setComments
}) {
  return (
    <>
      <Grid columns={2} stackable relaxed>
        <Grid.Column>
          <Modal.Content image>
            <img
              loading="lazy"
              style={{ width: "100%", height: "100%" }}
              alt={post.user.name}
              src={post.picUrl}
            />
          </Modal.Content>
        </Grid.Column>

        <Grid.Column>
          <Card fluid>
            <Card.Content>
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

              <Divider hidden />

              <div
                style={{
                  overflow: "auto",
                  height: comments.length > 2 ? "200px" : "60px",
                  marginBottom: "8px"
                }}
              >
                {comments.map(comment => (
                  <PostComments
                    key={comment._id}
                    comment={comment}
                    postId={post._id}
                    user={user}
                    setComments={setComments}
                  />
                ))}
              </div>

              <CommentInputField
                postId={post._id}
                user={user}
                setComments={setComments}
              />
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    </>
  );
}

export default ImageModal;
