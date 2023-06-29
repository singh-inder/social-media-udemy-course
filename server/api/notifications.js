const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const NotificationModel = require("../models/NotificationModel");
const UserModel = require("../models/UserModel");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;

    const user = await NotificationModel.findOne({ user: userId })
      .populate("notifications.user")
      .populate("notifications.post");

    return res.json(user.notifications);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;

    const user = await UserModel.findById(userId);

    if (user.unreadNotification) {
      user.unreadNotification = false;
      await user.save();
    }
    return res.status(200).send("Updated");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
