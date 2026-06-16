const { Server } = require("socket.io");
const dotenv = require("dotenv");
dotenv.config();
const { socketAuthMiddleware } = require("../middlewares/socketAuthMiddleware");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    const userId = socket.user.id || socket.user._id;

    if (userId) {
      socket.join(`user:${userId}`);
    }
  });

  return io;
};

const emitNotification = (recipientId, notification) => {
  if (!io || !recipientId) return;

  io.to(`user:${recipientId.toString()}`).emit("notification:new", notification);
};

const emitMessageToUser = (recipientId, payload) => {
  if (!io || !recipientId) return;

  io.to(`user:${recipientId.toString()}`).emit("message:new", payload);
};

module.exports = {
  initSocket,
  emitNotification,
  emitMessageToUser,
};
