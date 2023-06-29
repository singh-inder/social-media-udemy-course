const authMiddleware = require("../middleware/authMiddleware");
const ChatModel = require("../models/ChatModel");
const UserModel = require("../models/UserModel");
const { ObjectId } = require("mongoose").Types;

const express = require("express");
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const messagesWith = req.query.messagesWith || "";

    const withUserInfo = req.query.withUserInfo
      ? JSON.parse(req.query.withUserInfo)
      : false;

    if (!userId || !messagesWith) return res.sendStatus(401);

    const chat = await ChatModel.findOne(
      {
        user: new ObjectId(userId),
        "chats.messagesWith": new ObjectId(messagesWith)
      },
      { "chats.$": 1 }
    );

    let userInfo = {};

    if (withUserInfo) {
      const user = await UserModel.findById(messagesWith, "name profilePicUrl");

      userInfo = {
        messages: [],
        name: user?.name || "",
        profilePicUrl: user?.profilePicUrl || ""
      };
    }

    const doc = chat?.chats[0];

    if (doc) {
      res.json({
        messages: doc.messages,
        messagesWith: doc.messagesWith,
        _id: doc._id,
        ...userInfo
      });
    } else {
      res.json({ messages: [], ...userInfo });
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.delete("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { messagesWith, messageId } = req.query;
    if (!messagesWith || !messageId) return res.sendStatus(401);

    const result = await ChatModel.findOneAndUpdate(
      {
        user: new ObjectId(userId),
        "chats.messagesWith": new ObjectId(messagesWith)
      },
      { $pull: { "chats.$.messages": { _id: new ObjectId(messageId) } } },
      { rawResult: true, new: true }
    );

    if (Boolean(result.ok)) res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
