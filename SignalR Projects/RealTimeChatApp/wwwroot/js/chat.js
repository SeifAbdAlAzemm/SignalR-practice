/**
 * Extracts the username from the URL query parameters.
 */
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get("username");

if (!username) {
    alert("Username is required! Redirecting...");
    window.location.href = "/";
}

/**
 * Establishes a SignalR connection with the chat hub.
 */
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chathub?username=" + encodeURIComponent(username))
    .build();

/**
 * Handles receiving a public message from the server.
 * @param {string} user - The sender's username.
 * @param {string} message - The message content.
 */
connection.on("ReceiveMessage", (user, message) => {
    const msg = document.createElement("div");
    msg.classList.add("message");
    msg.innerHTML = `<strong>${user}:</strong> ${message}`;
    document.getElementById("publicMessages").appendChild(msg);
});

/**
 * Handles receiving a private message from another user.
 * @param {string} fromUser - The sender's username.
 * @param {string} message - The private message content.
 */
connection.on("ReceivePrivateMessage", (fromUser, message) => {
    const msg = document.createElement("div");
    msg.classList.add("private-message");
    msg.innerHTML = `<strong>${fromUser} (private):</strong> ${message}`;
    document.getElementById("privateMessages").appendChild(msg);
});

/**
 * Handles user connection events and updates the user list.
 * @param {string} user - The username of the connected user.
 */
connection.on("UserConnected", (user) => {
    updateUserList();
});

/**
 * Handles user disconnection events and updates the user list.
 * @param {string} user - The username of the disconnected user.
 */
connection.on("UserDisconnected", (user) => {
    updateUserList();
});

/**
 * Updates the list of connected users when received from the server.
 * @param {string[]} users - An array of currently connected usernames.
 */
connection.on("ConnectedUsersList", (users) => {
    const userList = document.getElementById("userList");
    const privateUserSelect = document.getElementById("privateUser");
    const winkUserSelect = document.getElementById("winkUserSelect"); // Wink feature select

    // Clear previous entries
    userList.innerHTML = "";
    privateUserSelect.innerHTML = "";
    winkUserSelect.innerHTML = '<option value="">Select a user</option>'; // Reset wink select

    users.forEach(user => {
        // Add user to public user list
        const li = document.createElement("li");
        li.innerText = user;
        userList.appendChild(li);

        // Add user to private message dropdown
        const privateOption = document.createElement("option");
        privateOption.value = user;
        privateOption.innerText = user;
        privateUserSelect.appendChild(privateOption);

        // Add user to wink dropdown
        const winkOption = document.createElement("option");
        winkOption.value = user;
        winkOption.innerText = user;
        winkUserSelect.appendChild(winkOption);
    });
});

/**
 * Sends a public message to all users.
 * Retrieves the message from the input field and invokes the "SendMessage" method on the server.
 */
async function sendMessage() {
    const message = document.getElementById("messageInput").value;
    if (message) {
        await connection.invoke("SendMessage", username, message);
        document.getElementById("messageInput").value = "";
    }
}

/**
 * Sends a private message to a specific user.
 * Retrieves the recipient's username and message from input fields, then invokes "SendPrivateMessage" on the server.
 */
async function sendPrivateMessage() {
    const toUser = document.getElementById("privateUser").value;
    const message = document.getElementById("privateMessageInput").value;
    if (toUser && message) {
        await connection.invoke("SendPrivateMessage", toUser, message);
        document.getElementById("privateMessageInput").value = "";
    }
}

/**
 * Requests an updated list of connected users from the server.
 */
async function updateUserList() {
    await connection.invoke("GetConnectedUsers");
}

/**
 * Starts the SignalR connection and fetches the connected users list.
 * If an error occurs, it is logged in the console.
 */
connection.start().then(() => updateUserList()).catch(err => console.error(err));
