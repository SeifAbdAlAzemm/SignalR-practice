"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var signalR = require("@microsoft/signalr");
require("./css/main.css");
// DOM Elements
var divMessages = document.querySelector("#divMessages");
var tbMessage = document.querySelector("#tbMessage");
var btnSend = document.querySelector("#btnSend");
var username = "User_".concat(new Date().getTime()); // Unique username
// Establish SignalR connection
var connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub")
    .withAutomaticReconnect() // Auto-reconnect on disconnection
    .configureLogging(signalR.LogLevel.Information)
    .build();
// Handle incoming messages
connection.on("messageReceived", function (sender, message) {
    var messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender === username ? "sent" : "received");
    messageDiv.innerHTML = "<div class=\"message-author\">".concat(sender, "</div><div>").concat(message, "</div>");
    divMessages.appendChild(messageDiv);
    divMessages.scrollTop = divMessages.scrollHeight; // Auto-scroll
});
// Start connection & handle errors
connection.start().catch(function (err) {
    console.error("SignalR Connection Error:", err);
    divMessages.innerHTML = "<div class=\"error\">\u26A0\uFE0F Unable to connect to chat</div>";
});
// Send message function
function sendMessage() {
    var message = tbMessage.value.trim();
    if (!message)
        return; // Prevent sending empty messages
    connection.send("newMessage", username, message)
        .then(function () {
        tbMessage.value = "";
        tbMessage.focus(); // Keep input focused after sending
        toggleSendButton(); // Disable send button if input is empty
    })
        .catch(function (err) { return console.error("Send Error:", err); });
}
// Enable 'Enter' to send
tbMessage.addEventListener("keyup", function (e) {
    if (e.key === "Enter")
        sendMessage();
    toggleSendButton(); // Toggle send button state
});
// Handle button click
btnSend.addEventListener("click", sendMessage);
// Disable send button if input is empty
function toggleSendButton() {
    btnSend.disabled = !tbMessage.value.trim();
}
toggleSendButton(); // Initialize button state
