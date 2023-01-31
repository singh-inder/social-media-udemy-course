import React from "react";
import { Divider, Feed } from "semantic-ui-react";
import calculateTime from "../../utils/calculateTime";

function CommentNotification({ notification }) {
  return (
    <>
      <Feed.Event>
        <Feed.Label>
          <img
            loading="lazy"
            src={notification.user.profilePicUrl}
            alt={notification.user.name}
          />
        </Feed.Label>
        <Feed.Content>
          <Feed.Summary>
            <>
              <Feed.User as="a" href={`/${notification.user.username}`}>
                {notification.user.name}
              </Feed.User>{" "}
              commented on your <a href={`/post/${notification.post._id}`}>post.</a>
              <Feed.Date>{calculateTime(notification.date)}</Feed.Date>
            </>
          </Feed.Summary>

          {notification.post.picUrl && (
            <Feed.Extra images>
              <a href={`/post/${notification.post._id}`}>
                <img loading="lazy" src={notification.post.picUrl} />
              </a>
            </Feed.Extra>
          )}
          <Feed.Extra text>
            <strong>{notification.text}</strong>
          </Feed.Extra>
        </Feed.Content>
      </Feed.Event>
      <Divider />
    </>
  );
}

export default CommentNotification;
