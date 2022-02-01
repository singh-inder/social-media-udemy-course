const UserModel = require("../models/UserModel");
const NotificationModel = require("../models/NotificationModel");

const setNotificationToUnread = async userId => {
  try {
    const user = await UserModel.findById(userId);

    if (!user.unreadNotification) {
      user.unreadNotification = true;
      await user.save();
    }

    return;
  } catch (error) {
    console.error(error);
  }
};

const newLikeNotification = async (userId, postId, userToNotifyId) => {
  try {
    const userToNotify = await NotificationModel.findOne({ user: userToNotifyId });

    const newNotification = {
      type: "newLike",
      user: userId,
      post: postId,
      date: Date.now()
    };

    await userToNotify.notifications.unshift(newNotification);
    await userToNotify.save();

    await setNotificationToUnread(userToNotifyId);
    return;
  } catch (error) {
    console.error(error);
  }
};

const removeLikeNotification = async (userId, postId, userToNotifyId) => {
  try {
    await NotificationModel.findOneAndUpdate(
      { user: userToNotifyId },
      {
        $pull: {
          notifications: {
            type: "newLike",
            user: userId,
            post: postId
          }
        }
      }
    );

    // const user = await NotificationModel.findOne({ user: userToNotifyId });
    //
    // const notificationToRemove = await user.notifications.find(
    //   notification =>
    //     notification.type === "newLike" &&
    //     notification.user.toString() === userId &&
    //     notification.post.toString() === postId
    // );

    // const indexOf = user.notifications
    //   .map(notification => notification._id.toString())
    //   .indexOf(notificationToRemove._id.toString());

    // await user.notifications.splice(indexOf, 1);
    // await user.save();

    return;
  } catch (error) {
    console.error(error);
  }
};

const newCommentNotification = async (
  postId,
  commentId,
  userId,
  userToNotifyId,
  text
) => {
  try {
    const userToNotify = await NotificationModel.findOne({ user: userToNotifyId });

    const newNotification = {
      type: "newComment",
      user: userId,
      post: postId,
      commentId,
      text,
      date: Date.now()
    };

    await userToNotify.notifications.unshift(newNotification);

    await userToNotify.save();

    await setNotificationToUnread(userToNotifyId);
    return;
  } catch (error) {
    console.error(error);
  }
};

const removeCommentNotification = async (postId, commentId, userId, userToNotifyId) => {
  try {
    await NotificationModel.findOneAndUpdate(
      { user: userToNotifyId },
      {
        $pull: {
          notifications: {
            type: "newComment",
            user: userId,
            post: postId,
            commentId: commentId
          }
        }
      }
    );

    // const user = await NotificationModel.findOne({ user: userToNotifyId });
    // const notificationToRemove = await user.notifications.find(
    //   notification =>
    //     notification.type === "newComment" &&
    //     notification.user.toString() === userId &&
    //     notification.post.toString() === postId &&
    //     notification.commentId === commentId
    // );

    // const indexOf = await user.notifications
    //   .map(notification => notification._id.toString())
    //   .indexOf(notificationToRemove._id.toString());

    // await user.notifications.splice(indexOf, 1);
    // await user.save();
    return;
  } catch (error) {
    console.error(error);
  }
};

const newFollowerNotification = async (userId, userToNotifyId) => {
  try {
    const user = await NotificationModel.findOne({ user: userToNotifyId });

    const newNotification = {
      type: "newFollower",
      user: userId,
      date: Date.now()
    };

    await user.notifications.unshift(newNotification);

    await user.save();

    await setNotificationToUnread(userToNotifyId);
    return;
  } catch (error) {
    console.error(error);
  }
};

const removeFollowerNotification = async (userId, userToNotifyId) => {
  try {
    await NotificationModel.findOneAndUpdate(
      { user: userToNotifyId },
      { $pull: { notifications: { type: "newFollower", user: userId } } }
    );

    return;

    // const user = await NotificationModel.findOne({ user: userToNotifyId });
    // const notificationToRemove = await user.notifications.find(
    //   notification =>
    //     notification.type === "newFollower" && notification.user.toString() === userId
    // );

    // const indexOf = await user.notifications
    //   .map(notification => notification._id.toString())
    //   .indexOf(notificationToRemove._id.toString());

    // await user.notifications.splice(indexOf, 1);

    // await user.save();
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  newLikeNotification,
  removeLikeNotification,
  newCommentNotification,
  removeCommentNotification,
  newFollowerNotification,
  removeFollowerNotification
};
