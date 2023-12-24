const express = require("express");
const cors = require("cors");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
require("dotenv").config();

const formatMessage = require("./utils/format");
const Message = require("./models/Message");

const messageController = require("./controllers/message");

const app = express();
app.use(cors());
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Connect to database.");
})

app.get("/chat/:roomName", messageController.getOldMessages);

const server = app.listen(4000, () => {
  console.log("Server is running.");
});

const io = socketIo(server, {
  cors: "*",
});

const users = [];

const saveUser = (id, username, room) => {
  const user = { id, username, room };
  users.push(user);
  return user;
};

const getDisconnectUser = (id) => {
    const index = users.findIndex(user => user.id == id);
    if(index != -1) {
        return users.splice(index, 1)[0];
    }
}

const getUserFromSameRoom = (room) => {
  return users.filter((user) => user.room == room);
}
io.on("connection", (socket) => {
  console.log("client connected.");
  const BOT = "CHAT TIME BOT";

  socket.on("joined_room", (data) => {
    const { username, room } = data;
    const user = saveUser(socket.id, username, room);
    socket.join(user.room);

    socket.emit("message", formatMessage(BOT, "Welcome to the room."));

    socket.broadcast
      .to(user.room)
      .emit("message", formatMessage(BOT, `${user.username} has joined the room.`));

    io.to(user.room).emit("total_users", getUserFromSameRoom(user.room))

    socket.on("message_send", (data) => {
      io.to(user.room).emit("message", formatMessage(user.username, data))
      return Message.create({
        username: user.username,
        message: data,
        sent_at: user.sent_at,
        room: user.room
      }).then((result) => {
        console.log("Message is sent");
      }).catch((err) => {
        console.log(err);
      });
    })
  });

  socket.on("disconnect", () => {
    const user = getDisconnectUser(socket.id);
    if(user) {
        io.to(user.room).emit("message", formatMessage(BOT, `${user.username} has left the room.`));
        io.to(user.room).emit("total_users", users)
    }
  });
});
