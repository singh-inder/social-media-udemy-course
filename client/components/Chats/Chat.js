import { Divider, Comment, Icon, List } from "semantic-ui-react";
import calculateTime from "../../utils/calculateTime";

function Chat({ chat, isOnline, deleteChat, openChatId, setOpenChatId }) {
  return (
    <>
      <List selection>
        <List.Item
          active={openChatId === chat.messagesWith}
          onClick={() => setOpenChatId(chat.messagesWith)}
        >
          <Comment>
            <Comment.Avatar src={chat.profilePicUrl} />
            <Comment.Content>
              <Comment.Author as="a">
                {chat.name}{" "}
                {isOnline && <Icon name="circle" size="small" color="green" />}
              </Comment.Author>

              <Comment.Metadata>
                <div>{calculateTime(chat.date)}</div>
                <div
                  style={{ position: "absolute", right: "10px", cursor: "pointer" }}
                >
                  <Icon
                    name="trash alternate"
                    color="red"
                    onClick={() => deleteChat(chat.messagesWith)}
                  />
                </div>
              </Comment.Metadata>

              <Comment.Text>
                {chat.lastMessage?.length > 20
                  ? `${chat.lastMessage.substring(0, 20)} ...`
                  : chat.lastMessage}
              </Comment.Text>
            </Comment.Content>
          </Comment>
        </List.Item>
      </List>
      <Divider />
    </>
  );
}

export default Chat;
