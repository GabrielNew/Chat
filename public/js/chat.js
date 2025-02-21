const socket = io();

const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormBtn = $messageForm.querySelector("button");

socket.on("welcomeMessage", (message) => {
  console.log("The message received was: " + message);
});

socket.on("message", (message) => {
  console.log(message);
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $messageFormBtn.setAttribute("disabled", "disabled");
  const msg = $messageFormInput.value;
  socket.emit("messageChat", msg, (callReturn) => {
    $messageFormBtn.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
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
