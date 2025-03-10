import * as signalR from "@microsoft/signalr";
import "./css/main.css";

// DOM Elements
const divMessages = document.querySelector("#divMessages") as HTMLDivElement;
const tbMessage = document.querySelector("#tbMessage") as HTMLInputElement;
const btnSend = document.querySelector("#btnSend") as HTMLButtonElement;
const username = `User_${new Date().getTime()}`; // Unique username

// Establish SignalR connection
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub")
    .withAutomaticReconnect() // Auto-reconnect on disconnection
    .configureLogging(signalR.LogLevel.Information)
    .build();

// Handle incoming messages
connection.on("messageReceived", (sender: string, message: string) => {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender === username ? "sent" : "received");
    messageDiv.innerHTML = `<div class="message-author">${sender}</div><div>${message}</div>`;

    divMessages.appendChild(messageDiv);
    divMessages.scrollTop = divMessages.scrollHeight; // Auto-scroll
});

// Start connection & handle errors
connection.start().catch((err) => {
    console.error("SignalR Connection Error:", err);
    divMessages.innerHTML = `<div class="error">⚠️ Unable to connect to chat</div>`;
});

// Send message function
function sendMessage() {
    const message = tbMessage.value.trim();
    if (!message) return; // Prevent sending empty messages

    connection.send("newMessage", username, message)
        .then(() => {
            tbMessage.value = "";
            tbMessage.focus(); // Keep input focused after sending
            toggleSendButton(); // Disable send button if input is empty
        })
        .catch((err) => console.error("Send Error:", err));
}

// Enable 'Enter' to send
tbMessage.addEventListener("keyup", (e: KeyboardEvent) => {
    if (e.key === "Enter") sendMessage();
    toggleSendButton(); // Toggle send button state
});

// Handle button click
btnSend.addEventListener("click", sendMessage);

// Disable send button if input is empty
function toggleSendButton() {
    btnSend.disabled = !tbMessage.value.trim();
}
toggleSendButton(); // Initialize button state
