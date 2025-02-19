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
  socket.emit("messageChat", msg, (callReturn) => {
    if (callReturn === "ERROR") {
      return console.log("Bad words arent allowed");
    }
    console.log("The message was delivered!" + callReturn);
  });
});

document.querySelector("#send-location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Your browser doesn't provide geolocation");
  }

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit("sendLocation", position, () => {
      console.log("Location shared!");
    });
  });
});
