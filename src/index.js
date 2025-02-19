import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";
import { Filter } from "bad-words";

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
  socket.emit("welcomeMessage", "Welcome to the chat!");
  socket.broadcast.emit("message", "A new user has joined!");

  socket.on("messageChat", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("ERROR");
    }
    io.emit("message", message);
    callback("Delivered");
  });

  socket.on("sendLocation", (location, callback) => {
    let link = `https://www.google.com/maps/search/?api=1&${location.coords.latitude},${location.coords.longitude}`;
    let msg = `Location: lat is ${location.coords.latitude}, long is ${location.coords.longitude}`;
    io.emit("message", link);
    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left!");
  });
});

server.listen(port, () => {
  console.log("The server is online on port: " + port);
});
