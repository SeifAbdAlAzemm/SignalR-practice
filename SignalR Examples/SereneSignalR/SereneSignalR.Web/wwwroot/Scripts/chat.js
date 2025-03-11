const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chathub")
    .build();

connection.on("ReceiveMessage", (user, message) => {
    const msg = document.createElement("div");
    msg.innerHTML = `<strong>${user}:</strong> ${message}`;
    document.getElementById("publicMessages").appendChild(msg);
});

async function sendMessage() {
    const message = document.getElementById("messageInput").value;
    if (message) {
        await connection.invoke("SendMessage", message);
        document.getElementById("messageInput").value = "";
    }
}

connection.start().catch(err => console.error(err));
