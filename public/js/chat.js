const socket = io();

let msg = "";

socket.on("welcomeMessage", (message) => {
  console.log("The message received was: " + message);
});

socket.on("message", (message) => {
  console.log(message);
});

document.querySelector("#btnSendMessage").addEventListener("click", (e) => {
  e.preventDefault();
  msg = document.querySelector("#messageInp").value;
  socket.emit("messageChat", msg);
});
