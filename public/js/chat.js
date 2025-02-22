const socket = io();

const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormBtn = $messageForm.querySelector("button");
const $messages = document.querySelector("#messages");
const messageTemplate = document.querySelector("#message-template").innerHTML;

socket.on("welcomeMessage", (message) => {
  console.log("The message received was: " + message);
});

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, { message: message });
  $messages.insertAdjacentHTML("beforeend", html);
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
