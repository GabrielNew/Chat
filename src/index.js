import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";
import { Filter } from "bad-words";
import generateMessages from "../src/utils/messages.js";

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
  socket.on("join", ({ username, room }) => {
    socket.join(room);

    socket.emit("message", generateMessages("Welcome"));
    socket.broadcast
      .to(room)
      .emit("message", generateMessages(`${username} has joined!`));
  });

  socket.on("messageChat", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("ERROR");
    }
    io.emit("message", generateMessages(message));
    callback("Delivered");
  });

  socket.on("disconnect", () => {
    io.emit("message", generateMessages("A user has left!"));
  });
});

server.listen(port, () => {
  console.log("The server is online on port: " + port);
});
