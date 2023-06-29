const jwt = require("jsonwebtoken");
const { Socket } = require("socket.io");

const users = new Map();
const pending = new Map();

const addUser = (userId, socketId) => {
  users.set(userId, socketId);
  removePending(userId);
  console.log(users);
};

const isConnected = userId => users.has(userId);

const findConnectedUser = userId => users.get(userId);

const removePending = userId => clearTimeout(pending.get(userId));

/**
 * @param {Socket} socket
 */
const removeUser = socket => {
  console.log("disconnected");
  const token = socket.handshake.headers["authorization"];
  if (!token) return;

  const { userId } = jwt.verify(token, process.env.jwtSecret);
  if (!userId) return;

  removePending(userId);

  const timeoutId = setTimeout(() => {
    users.delete(userId);
    pending.delete(userId);
    console.log("removed user " + userId);
  }, 10 * 1000);

  pending.set(userId, timeoutId);
};

module.exports = {
  addUser,
  removeUser,
  findConnectedUser,
  isConnected
};
