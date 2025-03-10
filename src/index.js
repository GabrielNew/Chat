import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";
import { Filter } from "bad-words";
import generateMessages from "../src/utils/messages.js";
import { addUser, getUser, getUsersInRoom, removeUser } from "./utils/users.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit("message", generateMessages(undefined, "Welcome"));
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessages(`${user.username} has joined!`));

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("messageChat", (message, callback) => {
    const user = getUser(socket.id);
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("ERROR");
    }
    io.to(user.room).emit("message", generateMessages(user.username, message));
    callback("Delivered");
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessages(undefined, `${user.username} has left!`)
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(port, () => {
  console.log("The server is online on port: " + port);
});
