import { useCallback, useState } from "react";
import { Form, Modal, Segment, List, Icon } from "semantic-ui-react";
import Link from "next/link";
import calculateTime from "../../utils/calculateTime";
import styles from "../Messages/listMessages.module.css";
import socket from "@/service/socket";

const { bubbleWrapper, inlineContainer, inlineIcon, otherBubble, other } = styles;

function MessageNotificationModal({
  showNewMessageModal,
  newMessageModal,
  newMessageReceived,
  user
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const onModalClose = () => showNewMessageModal(false);

  // prettier-ignore
  const formSubmit = useCallback(e => {
    e.preventDefault();

    socket.emit("sendMsgFromNotification", {
      userId: user._id,
      msgSendToUserId: newMessageReceived.sender,
      msg: text
    });

    socket.on("msgSentFromNotification", () => {
      showNewMessageModal(false);
    });
  }, [newMessageReceived, showNewMessageModal, text, user]);

  return (
    <>
      <Modal
        size="small"
        open={newMessageModal}
        onClose={onModalClose}
        closeIcon
        closeOnDimmerClick
      >
        <Modal.Header content={`New Message from ${newMessageReceived.senderName}`} />

        <Modal.Content>
          <div className={bubbleWrapper}>
            <div className={inlineContainer}>
              <img
                loading="lazy"
                className={inlineIcon}
                src={newMessageReceived.senderProfilePic}
              />
            </div>

            <div className={`${otherBubble} ${other}`}>{newMessageReceived.msg}</div>

            <span className={other}>{calculateTime(newMessageReceived.date)}</span>
          </div>

          <div style={{ position: "sticky", bottom: "0px" }}>
            <Segment secondary color="teal" attached="bottom">
              <Form reply onSubmit={formSubmit}>
                <Form.Input
                  size="large"
                  placeholder="Send New Message"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  action={{
                    color: "blue",
                    icon: "telegram plane",
                    disabled: text === "",
                    loading: loading
                  }}
                />
              </Form>
            </Segment>
          </div>

          <div style={{ marginTop: "5px" }}>
            <Link href={`/messages?message=${newMessageReceived.sender}`}>
              View All Messages
            </Link>

            <br />

            <Instructions username={user.username} />
          </div>
        </Modal.Content>
      </Modal>
    </>
  );
}

const Instructions = ({ username }) => (
  <List>
    <List.Item>
      <Icon name="help" />
      <List.Content>
        <List.Header>
          If you do not like this popup to appear when you receive a new message:
        </List.Header>
      </List.Content>
    </List.Item>

    <List.Item>
      <Icon name="hand point right" />
      <List.Content>
        You can disable it by going to
        <Link href={`/${username}`}>Account</Link>
        Page and clicking on Settings Tab.
      </List.Content>
    </List.Item>

    <List.Item>
      <Icon name="hand point right" />
      Inside the menu,there is an setting named: Show New Message Popup?
    </List.Item>

    <List.Item>
      <Icon name="hand point right" />
      Just toggle the setting to disable/enable the Message Popup to appear.
    </List.Item>
  </List>
);

export default MessageNotificationModal;
