import { Comment, Icon } from "semantic-ui-react";
import calculateTime from "../../utils/calculateTime";
import { deleteComment } from "../../utils/postActions";

function PostComments({ comment, user, setComments, postId }) {
  return (
    <>
      <Comment.Group>
        <Comment>
          <Comment.Avatar src={comment.user.profilePicUrl} />
          <Comment.Content>
            <Comment.Author as="a" href={`/${comment.user.username}`}>
              {comment.user.name}
            </Comment.Author>
            <Comment.Metadata>{calculateTime(comment.date)}</Comment.Metadata>

            <Comment.Text>{comment.text}</Comment.Text>

            <Comment.Actions>
              <Comment.Action>
                {(user.role === "root" || comment.user._id === user._id) && (
                  <Icon
                    color="red"
                    name="trash"
                    onClick={async () => {
                      await deleteComment(postId, comment._id, setComments);
                    }}
                  />
                )}
              </Comment.Action>
            </Comment.Actions>
          </Comment.Content>
        </Comment>
      </Comment.Group>
    </>
  );
}

export default PostComments;
