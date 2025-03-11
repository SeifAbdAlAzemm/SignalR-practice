import * as signalR from "../lib/microsoft/signalr/dist/browser/signalr.js";

// Establish connection to SignalR Hub
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chathub") // 👈 Connects to the server hub
    .build();

// Handle received messages
connection.on("ReceiveMessage", (user, message) => {
    console.log(`${user}: ${message}`);
    const chatBox = document.getElementById("chatBox") as HTMLDivElement;
    chatBox.innerHTML += `<p><strong>${user}:</strong> ${message}</p>`;
});

// Start the connection
connection.start().catch(err => console.error(err));

// Send message function
function sendMessage() {
    const user = (document.getElementById("username") as HTMLInputElement).value;
    const message = (document.getElementById("message") as HTMLInputElement).value;

    if (user && message) {
        connection.invoke("SendMessage", user, message).catch(err => console.error(err));
    }
}

// Attach sendMessage to a button
document.getElementById("sendBtn")?.addEventListener("click", sendMessage);
