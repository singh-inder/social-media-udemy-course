const UserModel = require("../models/UserModel");
const PostModel = require("../models/PostModel");
const {
  newLikeNotification,
  removeLikeNotification
} = require("./notificationActions");

const likeOrUnlikePost = async (postId, userId, like) => {
  try {
    const post = await PostModel.findById(postId);

    if (!post) return { error: "No post found" };
    const postByUserId = post.user.toString();

    if (like) {
      const isLiked =
        post.likes.filter(like => like.user.toString() === userId).length > 0;

      if (isLiked) return { error: "Post liked before" };

      await post.likes.unshift({ user: userId });

      await post.save();

      if (postByUserId !== userId) {
        await newLikeNotification(userId, postId, postByUserId);
      }
    }
    //
    else {
      const isLiked =
        post.likes.filter(like => like.user.toString() === userId).length === 0;

      if (isLiked) return { error: "Post not liked before" };

      const indexOf = post.likes.map(like => like.user.toString()).indexOf(userId);

      await post.likes.splice(indexOf, 1);

      await post.save();

      if (postByUserId !== userId) {
        await removeLikeNotification(userId, postId, postByUserId);
      }
    }

    const user = await UserModel.findById(userId);

    const { name, profilePicUrl, username } = user;

    return {
      success: true,
      name,
      profilePicUrl,
      username,
      postByUserId
    };
  } catch (error) {
    return { error: "Server error" };
  }
};

module.exports = { likeOrUnlikePost };
