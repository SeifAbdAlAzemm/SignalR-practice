# 🚀 Real-Time Chat Application

A modern, responsive chat application built with ASP.NET Core and SignalR that enables instant messaging, private conversations, and real-time user status updates.

## ✨ Features

- **Real-time messaging** - Messages appear instantly for all users
- **User presence** - See who's online and receive notifications when users join or leave
- **Private messaging** - Send confidential messages to specific users
- **Persistent connections** - WebSockets with automatic fallback to other transport methods
- **Clean, intuitive UI** - Simple and responsive interface

## 📋 Project Structure

```
RealTimeChatApp/
│
├── Pages/                            # Razor Pages for UI
│   ├── Index.cshtml                  # Welcome/login page
│   ├── Index.cshtml.cs               # Page model for index
│   ├── Chat.cshtml                   # Main chat interface
│   └── Chat.cshtml.cs                # Chat page model (retrieves username)
│
├── Hubs/
│   └── ChatHub.cs                    # SignalR hub that handles real-time communication
│
├── wwwroot/
│   ├── css/
│   │   └── chat.css                  # Chat-specific styles
│   ├── js/
│   │   └── chat.js                   # Client-side SignalR integration
│   └── lib/                          # Client libraries (SignalR, Bootstrap, etc.)
│
├── Program.cs                        # Application configuration and startup
└── appsettings.json                  # Application settings
```

## 🛠️ How It Works

### High-Level Overview

1. **User joins the chat** - They enter their name on the welcome page
2. **SignalR registers the user** - Their presence is broadcasted to all connected clients
3. **Message exchange** - Users can send public messages (to everyone) or private messages (to specific users)
4. **Real-time updates** - All changes (new messages, user status) are instantly pushed to clients
5. **Disconnection handling** - When a user leaves, others are notified

### Deep Dive: Code Components

#### 1. ChatHub.cs (Backend Logic)

The ChatHub acts as the central communication controller. It:

- **Manages user connections** - Tracks who's online using a thread-safe `ConcurrentDictionary`
- **Broadcasts messages** - Sends messages to all connected clients
- **Enables private messaging** - Delivers messages to specific recipients
- **Handles user presence** - Notifies when users join or leave

Key implementation details:

```csharp
// Track connected users with their connection IDs
private static readonly ConcurrentDictionary<string, string> ConnectedUsers = new();

// When a user connects
public override async Task OnConnectedAsync()
{
    string username = Context.GetHttpContext().Request.Query["username"];
    if (!string.IsNullOrEmpty(username))
    {
        ConnectedUsers[Context.ConnectionId] = username;
        await Clients.All.SendAsync("UserConnected", username);
    }
    await base.OnConnectedAsync();
}

// Send message to all users
public async Task SendMessage(string username, string message)
{
    await Clients.All.SendAsync("ReceiveMessage", username, message);
}

// Send private message to a specific user
public async Task SendPrivateMessage(string toUser, string message)
{
    var recipient = ConnectedUsers.FirstOrDefault(u => u.Value == toUser);
    if (!string.IsNullOrEmpty(recipient.Key))
    {
        await Clients.Client(recipient.Key).SendAsync("ReceivePrivateMessage", 
            ConnectedUsers[Context.ConnectionId], message);
    }
}
```

#### 2. chat.js (Frontend Integration)

The client-side JavaScript connects to SignalR and:

- **Establishes connection** - Creates a persistent connection to the hub
- **Renders messages** - Displays incoming messages in the chat interface
- **Sends user input** - Transmits messages to the server
- **Updates UI** - Maintains the user list and handles private messaging UI

Key implementation details:

```javascript
// Create SignalR connection
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chathub?username=" + encodeURIComponent(username))
    .build();

// Handle incoming messages
connection.on("ReceiveMessage", (user, message) => {
    const msg = document.createElement("div");
    msg.classList.add("message");
    msg.innerHTML = `<strong>${user}:</strong> ${message}`;
    document.getElementById("messages").appendChild(msg);
});

// Send message function
async function sendMessage() {
    const message = document.getElementById("messageInput").value;
    if (message) {
        await connection.invoke("SendMessage", username, message);
        document.getElementById("messageInput").value = "";
    }
}
```

#### 3. Chat.cshtml (User Interface)

The Razor Page provides:

- **Message display area** - Shows all received messages
- **Input controls** - Text field and button to send new messages
- **User list** - Shows who's currently online
- **Private messaging** - Dropdown to select users for private chats

#### 4. Chat.cshtml.cs (Page Model)

This handles the initial page load and retrieves the username from the query string:

```csharp
public class ChatModel : PageModel
{
    public string Username { get; set; }

    public void OnGet()
    {
        // Get username from query params
        Username = Request.Query["username"];
    }
}
```

## 🧩 The Flow: From Connection to Communication

Here's what happens when Alex joins the chat:

1. **Alex opens the chat page**
   - The URL contains their username: `/Chat?username=Alex`
   - `Chat.cshtml.cs` extracts and stores this username
   - The page renders with a personalized welcome message

2. **SignalR connection is established**
   - `chat.js` creates a connection to the ChatHub
   - The username is passed in the connection URL
   - `ChatHub.OnConnectedAsync()` adds Alex to the connected users dictionary
   - All other users are notified of Alex's arrival

3. **Alex sends a message**
   - The message is captured from the input field
   - `connection.invoke("SendMessage", username, message)` sends it to the server
   - `ChatHub.SendMessage()` broadcasts it to all connected clients
   - Each client's `ReceiveMessage` handler displays the message

4. **Alex sends a private message to Sarah**
   - Alex selects Sarah from the dropdown and types a message
   - `connection.invoke("SendPrivateMessage", toUser, message)` sends it
   - `ChatHub.SendPrivateMessage()` finds Sarah's connection and delivers the message
   - Only Sarah receives a notification with Alex's message

5. **Alex leaves the chat**
   - The browser tab is closed or the connection is lost
   - `ChatHub.OnDisconnectedAsync()` detects this and removes Alex from the users list
   - All other users are notified that Alex has left

## 💻 Getting Started

### Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download) or newer
- [Visual Studio 2022](https://visualstudio.microsoft.com/vs/) or any code editor

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/RealTimeChatApp.git
   cd RealTimeChatApp
   ```

2. Build the application
   ```bash
   dotnet build
   ```

3. Run the application
   ```bash
   dotnet run
   ```

4. Open your browser and navigate to:
   ```
   https://localhost:5001
   ```

## 🔮 Future Enhancements

We have several exciting features planned for future releases:

1. **Typing Indicator** - Show when users are currently typing
2. **Read Receipts** - Know when your messages have been seen
3. **Message Editing & Deletion** - Modify or remove sent messages
4. **Group Chat Support** - Create private rooms for team discussions
5. **User Status** - Set your status (Online/Away/Busy/Offline)
6. **File Sharing** - Send images and documents
7. **Chat History** - Store and load previous conversations
8. **Emoji & Reactions** - React to messages with emoji
9. **Notification Sounds** - Audio alerts for new messages
10. **Dark Mode** - Toggle between light and dark themes

## 🔧 Code Improvements Roadmap

Potential optimizations to enhance the existing codebase:

1. **Optimize User List Updates** - Reduce unnecessary server calls
2. **Improve Message Rendering** - Use structured objects instead of raw HTML
3. **Handle Connection Failures** - Implement automatic reconnection
4. **Prevent Duplicate Messages** - Ensure messages are sent exactly once
5. **Enhance UI/UX** - Add animations and improve message styling

## 📚 Technologies Used

- **ASP.NET Core** - Web framework
- **SignalR** - Real-time communication library
- **Razor Pages** - Server-side UI framework
- **JavaScript** - Client-side functionality
- **HTML/CSS** - Frontend styling

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Microsoft SignalR Documentation](https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction)
- [ASP.NET Core Documentation](https://learn.microsoft.com/en-us/aspnet/core)

---

Made with ❤️ by Seif Abd AlAzem
