const express = require("express");
const router = express.Router();
const ChatModel = require("../models/ChatModel");
const UserModel = require("../models/UserModel");
const authMiddleware = require("../middleware/authMiddleware");

// GET ALL CHATS

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;

    const user = await ChatModel.findOne({ user: userId }).populate(
      "chats.messagesWith"
    );

    if (!user) return res.json([]);

    let chatsToBeSent = [];

    if (user.chats.length > 0) {
      chatsToBeSent = user.chats.map(chat => ({
        messagesWith: chat.messagesWith._id,
        name: chat.messagesWith.name,
        profilePicUrl: chat.messagesWith.profilePicUrl,
        lastMessage: chat.messages[chat.messages.length - 1].msg,
        date: chat.messages[chat.messages.length - 1].date
      }));
    }

    return res.json(chatsToBeSent);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

// GET USER INFO

router.get("/user/:userToFindId", authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userToFindId);

    if (!user) {
      return res.status(404).send("No User found");
    }

    return res.json({ name: user.name, profilePicUrl: user.profilePicUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

// Delete a chat

router.delete(`/:messagesWith`, authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const { messagesWith } = req.params;

    await ChatModel.findOneAndUpdate(
      { user: userId },
      { $pull: { chats: { messagesWith } } }
    );
    return res.status(200).send("Chat deleted");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

// SET UNREAD MESSAGE TO READ

router.post("/", authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (user.unreadMessage) {
      user.unreadMessage = false;
      await user.save();
    }

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

module.exports = router;
