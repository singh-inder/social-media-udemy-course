// prettier-ignore
const { Types: { ObjectId } } = require("mongoose");
const ChatModel = require("../models/ChatModel");
const UserModel = require("../models/UserModel");

/**
 * @deprecated messages fetched from /api/messages endpoint
 */
const loadMessages = async (userId, messagesWith) => {
  try {
    const chat = await ChatModel.findOne({
      user: new ObjectId(userId),
      "chats.messagesWith": new ObjectId(messagesWith)
    });

    if (!chat) {
      return { error: "No chat found" };
    }

    return { chat: chat.chats[0] };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const updateChat = async (userId, messagesWith, newMsg) => {
  const status = await ChatModel.findOneAndUpdate(
    { user: userId, "chats.messagesWith": messagesWith },
    { $push: { "chats.$.messages": newMsg } }
  );

  if (!status) {
    const newChat = { messagesWith, messages: [newMsg] };

    await ChatModel.findOneAndUpdate(
      { user: userId },
      { $push: { chats: newChat, $position: 0 } },
      { upsert: true }
    );
  }
};

const sendMsg = async (userId, msgSendToUserId, msg = "") => {
  try {
    if (!msg) return { error: "No msg text" };

    const sender = new ObjectId(userId),
      receiver = new ObjectId(msgSendToUserId);

    const newMsg = {
      _id: new ObjectId(),
      sender,
      receiver,
      msg,
      date: new Date()
    };

    // LOGGED IN USER (SENDER)
    await updateChat(sender, receiver, newMsg);

    // RECEIVER
    await updateChat(receiver, sender, newMsg);

    return { newMsg };
  } catch (error) {
    console.error(error);
    return { error };
  }
};

const setMsgToUnread = async userId => {
  try {
    const user = await UserModel.findById(userId);

    if (!user.unreadMessage) {
      user.unreadMessage = true;
      await user.save();
    }

    return;
  } catch (error) {
    console.error(error);
  }
};

/**
 * @deprecated message deleted from /api/messages endpoint
 */
const deleteMsg = async (userId, messagesWith, messageId) => {
  try {
    const user = await ChatModel.findOne({ user: userId });

    const chat = user.chats.find(
      chat => chat.messagesWith.toString() === messagesWith
    );

    if (!chat) return;

    const messageToDelete = chat.messages.find(
      message => message._id.toString() === messageId
    );

    if (!messageToDelete) return;

    if (messageToDelete.sender.toString() !== userId) {
      return;
    }

    const indexOf = chat.messages
      .map(message => message._id.toString())
      .indexOf(messageToDelete._id.toString());

    await chat.messages.splice(indexOf, 1);

    await user.save();

    return { success: true };
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendMsg, setMsgToUnread };
