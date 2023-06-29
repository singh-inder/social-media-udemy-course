/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Icon, Popup } from "semantic-ui-react";
import styles from "./listMessages.module.css";
import calculateTime from "../../utils/calculateTime";

// prettier-ignore
const { bubbleWrapper,inlineContainer, inlineIcon, ownBubble,otherBubble, own, other } = styles;

function Message({ message, user, deleteMsg, bannerProfilePic }) {
  const [deleteIcon, showDeleteIcon] = useState(false);

  const ifYouSender = message.sender === user._id;

  return (
    <div className={bubbleWrapper}>
      <div
        className={ifYouSender ? `${inlineContainer} ${own}` : inlineContainer}
        onClick={() => ifYouSender && showDeleteIcon(!deleteIcon)}
      >
        <img
          alt={ifYouSender ? user.name : "receiver"}
          loading="lazy"
          className={inlineIcon}
          src={ifYouSender ? user.profilePicUrl : bannerProfilePic}
        />

        <div
          className={ifYouSender ? `${ownBubble} ${own}` : `${otherBubble} ${other}`}
        >
          {message.msg}
        </div>

        {deleteIcon && (
          <Popup
            trigger={
              <Icon
                name="trash"
                color="red"
                style={{ cursor: "pointer" }}
                onClick={() => deleteMsg(message._id)}
              />
            }
            content="This will only delete the message from your inbox!"
            position="top right"
          />
        )}
      </div>

      <span className={ifYouSender ? own : other}>{calculateTime(message.date)}</span>
    </div>
  );
}

export default Message;
