const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const UserModel = require("../models/UserModel");
const PostModel = require("../models/PostModel");
const FollowerModel = require("../models/FollowerModel");
const uuid = require("uuid").v4;
const {
  newLikeNotification,
  removeLikeNotification,
  newCommentNotification,
  removeCommentNotification
} = require("../utilsServer/notificationActions");

// CREATE A POST

router.post("/", authMiddleware, async (req, res) => {
  const { text, location, picUrl } = req.body;

  if (text.length === 0)
    return res.status(401).send("Text must be atleast 1 character");

  try {
    const newPost = {
      user: req.userId,
      text
    };
    if (location) newPost.location = location;
    if (picUrl) newPost.picUrl = picUrl;

    const post = await new PostModel(newPost).save();

    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

// GET ALL POSTS

router.get("/", authMiddleware, async (req, res) => {
  const { pageNumber } = req.query;

  try {
    const number = Number(pageNumber);
    const size = 8;
    const { userId } = req;

    const loggedUser = await FollowerModel.findOne({ user: userId }).select(
      "-followers"
    );

    let posts = [];

    if (number === 1) {
      if (loggedUser.following.length > 0) {
        posts = await PostModel.find({
          user: {
            $in: [userId, ...loggedUser.following.map(following => following.user)]
          }
        })
          .limit(size)
          .sort({ createdAt: -1 })
          .populate("user")
          .populate("comments.user");
      }
      //
      else {
        posts = await PostModel.find({ user: userId })
          .limit(size)
          .sort({ createdAt: -1 })
          .populate("user")
          .populate("comments.user");
      }
    }

    //
    else {
      const skips = size * (number - 1);

      if (loggedUser.following.length > 0) {
        posts = await PostModel.find({
          user: {
            $in: [userId, ...loggedUser.following.map(following => following.user)]
          }
        })
          .skip(skips)
          .limit(size)
          .sort({ createdAt: -1 })
          .populate("user")
          .populate("comments.user");
      }
      //
      else {
        posts = await PostModel.find({ user: userId })
          .skip(skips)
          .limit(size)
          .sort({ createdAt: -1 })
          .populate("user")
          .populate("comments.user");
      }
    }

    return res.json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

// GET POST BY ID

router.get("/:postId", authMiddleware, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postId)
      .populate("user")
      .populate("comments.user");

    if (!post) {
      return res.status(404).send("Post not found");
    }

    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

// DELETE POST

router.delete("/:postId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;

    const { postId } = req.params;

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).send("post not found");
    }

    const deletePost = async () => {
      await post.remove();
      return res.status(200).send("Post deleted Successfully");
    };

    if (post.user.toString() !== userId) {
      const user = await UserModel.findById(userId);
      if (user.role === "root") {
        await deletePost();
      } else {
        return res.status(401).send("Unauthorized");
      }
    }

    await deletePost();
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

// LIKE A POST

router.post("/like/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req;

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).send("No Post found");
    }

    const isLiked = post.likes.some(like => like.user.toString() === userId);

    if (isLiked) {
      return res.status(401).send("Post already liked");
    }

    post.likes.unshift({ user: userId });
    await post.save();

    const postByUserId = post.user.toString();

    if (postByUserId !== userId) {
      await newLikeNotification(userId, postId, postByUserId);
    }

    return res.status(200).send("Post liked");
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

// UNLIKE A POST

router.put("/unlike/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req;

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).send("No Post found");
    }

    const isLiked = post.likes.some(like => like.user.toString() === userId);

    if (!isLiked) {
      return res.status(401).send("Post not liked before");
    }

    const index = post.likes.findIndex(like => like.user.toString() === userId);

    post.likes.splice(index, 1);

    await post.save();

    const postByUserId = post.user.toString();

    if (postByUserId !== userId) {
      await removeLikeNotification(userId, postId, postByUserId);
    }

    return res.status(200).send("Post Unliked");
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

// GET ALL LIKES OF A POST

router.get("/like/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await PostModel.findById(postId).populate("likes.user");
    if (!post) {
      return res.status(404).send("No Post found");
    }

    return res.status(200).json(post.likes);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

// CREATE A COMMENT

router.post("/comment/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;

    const { userId } = req;
    const { text } = req.body;

    if (text.length < 1)
      return res.status(401).send("Comment should be atleast 1 character");

    const post = await PostModel.findById(postId);

    if (!post) return res.status(404).send("Post not found");

    const newComment = {
      _id: uuid(),
      text,
      user: userId,
      date: Date.now()
    };

    post.comments.unshift(newComment);
    await post.save();

    const postByUserId = post.user.toString();

    if (postByUserId !== userId) {
      await newCommentNotification(postId, newComment._id, userId, postByUserId, text);
    }

    return res.status(200).json(newComment._id);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

// DELETE A COMMENT

router.delete("/comment/:postId/:commentId", authMiddleware, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId } = req;

    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).send("Post not found");

    const index = post.comments.findIndex(comment => comment._id === commentId);
    if (index === -1) {
      return res.status(404).send("No Comment found");
    }
    const comment = post.comments[index];

    const deleteComment = async () => {
      post.comments.splice(index, 1);

      await post.save();

      const postByUserId = post.user.toString();

      if (postByUserId !== userId) {
        await removeCommentNotification(postId, commentId, userId, postByUserId);
      }

      return res.status(200).send("Deleted Successfully");
    };

    if (comment.user.toString() !== userId) {
      const user = await UserModel.findById(userId);
      if (user.role === "root") {
        await deleteComment();
      } else {
        return res.status(401).send("Unauthorized");
      }
    }

    await deleteComment();
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

module.exports = router;
