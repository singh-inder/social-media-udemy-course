import axios from "axios";
import { toast } from "react-toastify";
import cookie from "js-cookie";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";

export const Axios = axios.create({
  baseURL: `${baseUrl}/api/posts`,
  headers: { Authorization: cookie.get("token") }
});

const toastError = error => toast.error(catchErrors(error));

export const submitNewPost = async (newPost, picUrl) => {
  try {
    const { data } = await Axios.post("/", { ...newPost, picUrl });

    return { data };
  } catch (error) {
    throw catchErrors(error);
  }
};

export const deletePost = async (postId, setPosts) => {
  try {
    await Axios.delete(`/${postId}`);
    setPosts(prev => prev.filter(post => post._id !== postId));

    toast.info("Post deleted successfully");
  } catch (error) {
    toastError(error);
  }
};

export const likePost = async (postId, userId, setLikes, like = true) => {
  try {
    if (like) {
      await Axios.post(`/like/${postId}`);
      setLikes(prev => [...prev, { user: userId }]);
    }
    //
    else if (!like) {
      await Axios.put(`/unlike/${postId}`);
      setLikes(prev => prev.filter(like => like.user !== userId));
    }
  } catch (error) {
    toastError(error);
  }
};

export const postComment = async (postId, user, text, setComments, setText) => {
  try {
    const res = await Axios.post(`/comment/${postId}`, { text });

    const newComment = {
      _id: res.data,
      user,
      text,
      date: Date.now()
    };

    setComments(prev => [newComment, ...prev]);
    setText("");
  } catch (error) {
    toastError(error);
  }
};

export const deleteComment = async (postId, commentId, setComments) => {
  try {
    await Axios.delete(`/comment/${postId}/${commentId}`);
    setComments(prev => prev.filter(comment => comment._id !== commentId));
  } catch (error) {
    toastError(error);
  }
};
