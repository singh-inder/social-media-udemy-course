require("dotenv").config({ path: "./config.env" });
const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

const { createServer } = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const server = createServer(app);

const frontendAppUrl = process.env.FRONTEND_URL;
if (!frontendAppUrl) {
  console.error("Provide FRONTEND_URL env variable in config.env file");
  process.exit(1);
}
const connectDb = require("./utilsServer/connectDb");

app.use(cors({ origin: frontendAppUrl }));
app.use(express.json());

const io = new Server(server, {
  cors: { origin: frontendAppUrl }
  /* options */
});

const PORT = process.env.PORT || 5000;
const {
  addUser,
  removeUser,
  findConnectedUser,
  isConnected
} = require("./utilsServer/roomActions");
const { sendMsg, setMsgToUnread } = require("./utilsServer/messageActions");

const { likeOrUnlikePost } = require("./utilsServer/likeOrUnlikePost");

io.use((socket, next) => {
  const authorization = socket.handshake.headers["authorization"];

  if (!authorization) {
    console.log("not accepted");
    return next(new Error("Not Authenticated"));
  }

  try {
    jwt.verify(authorization, process.env.jwtSecret);
    next();
  } catch (error) {
    next(new Error("Not Authenticated"));
  }
});

io.on("connection", socket => {
  socket.on("join", ({ userId }) => {
    addUser(userId, socket.id);
  });

  socket.on("checkOnlineStatus", ({ users }) => {
    if (!users || !users.hasOwnProperty("length")) return;
    const onlineUsers = {};

    for (let i = 0; i < users.length; i++) {
      const userId = users[i];
      onlineUsers[userId] = isConnected(userId);
    }

    socket.emit("onlineStatusChecked", { onlineUsers });
  });

  socket.on("likePost", async ({ postId, userId, like }) => {
    const { success, name, profilePicUrl, username, postByUserId, error } =
      await likeOrUnlikePost(postId, userId, like);

    if (success) {
      socket.emit("postLiked");

      if (postByUserId !== userId) {
        const receiverSocket = findConnectedUser(postByUserId);

        if (receiverSocket && like) {
          // WHEN YOU WANT TO SEND DATA TO ONE PARTICULAR CLIENT
          io.to(receiverSocket).emit("newNotificationReceived", {
            name,
            profilePicUrl,
            username,
            postId
          });
        }
      }
    }
  });

  socket.on("sendNewMsg", async ({ userId, msgSendToUserId, msg }) => {
    const { newMsg, error } = await sendMsg(userId, msgSendToUserId, msg);
    const receiverSocket = findConnectedUser(msgSendToUserId);

    if (receiverSocket) {
      // WHEN YOU WANT TO SEND MESSAGE TO A PARTICULAR SOCKET
      io.to(receiverSocket).emit("newMsgReceived", { newMsg });
    }
    //
    else {
      await setMsgToUnread(msgSendToUserId);
    }

    !error && socket.emit("msgSent", { newMsg });
  });

  socket.on("sendMsgFromNotification", async ({ userId, msgSendToUserId, msg }) => {
    const { newMsg, error } = await sendMsg(userId, msgSendToUserId, msg);
    const receiverSocket = findConnectedUser(msgSendToUserId);

    if (receiverSocket) {
      // WHEN YOU WANT TO SEND MESSAGE TO A PARTICULAR SOCKET
      io.to(receiverSocket).emit("newMsgReceived", { newMsg });
    }
    //
    else {
      await setMsgToUnread(msgSendToUserId);
    }

    !error && socket.emit("msgSentFromNotification");
  });

  socket.on("disconnect", () => removeUser(socket));
});

fs.readdirSync(path.resolve(`./api`)).map(filePath =>
  app.use(`/api/${filePath.split(".")[0]}`, require(`./api/${filePath}`))
);

connectDb().then(() => {
  server.listen(PORT, err => {
    if (err) throw err;
    console.log("Express server running");
  });
});
