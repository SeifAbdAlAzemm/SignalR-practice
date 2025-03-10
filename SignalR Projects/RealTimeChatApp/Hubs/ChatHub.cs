using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;

namespace RealTimeChatApp.Hubs
{
    /// <summary>
    /// ChatHub is a SignalR hub that manages real-time communication between users.
    /// It allows users to send public and private messages, notifies users when someone connects or disconnects, 
    /// and provides a list of active users.
    /// </summary>
    public class ChatHub : Hub
    {
        /// <summary>
        /// A thread-safe dictionary to keep track of connected users.
        /// Key: Connection ID, Value: Username.
        /// </summary>
        private static readonly ConcurrentDictionary<string, string> ConnectedUsers = new();

        /// <summary>
        /// Called when a user establishes a connection with the hub.
        /// Adds the user to the list of connected users and notifies all clients.
        /// </summary>
        /// <returns>A Task representing the asynchronous operation.</returns>
        public override async Task OnConnectedAsync()
        {
            string username = Context.GetHttpContext().Request.Query["username"];

            if (!string.IsNullOrEmpty(username))
            {
                // Store the user's connection
                ConnectedUsers[Context.ConnectionId] = username;

                // Notify all clients about the new user
                await Clients.All.SendAsync("UserConnected", username);
            }

            await base.OnConnectedAsync();
        }

        /// <summary>
        /// Called when a user disconnects from the hub.
        /// Removes the user from the connected users list and notifies all clients.
        /// </summary>
        /// <param name="exception">The exception that caused the disconnect, if any.</param>
        /// <returns>A Task representing the asynchronous operation.</returns>
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            if (ConnectedUsers.TryRemove(Context.ConnectionId, out string username))
            {
                // Notify all clients about the disconnection
                await Clients.All.SendAsync("UserDisconnected", username);
            }

            await base.OnDisconnectedAsync(exception);
        }

        /// <summary>
        /// Sends a public message to all connected users.
        /// </summary>
        /// <param name="username">The sender's username.</param>
        /// <param name="message">The message content.</param>
        /// <returns>A Task representing the asynchronous operation.</returns>
        public async Task SendMessage(string username, string message)
        {
            if (!string.IsNullOrWhiteSpace(message))
            {
                // Broadcast message to all clients
                await Clients.All.SendAsync("ReceiveMessage", username, message);
            }
        }

        /// <summary>
        /// Sends a private message to a specific user.
        /// </summary>
        /// <param name="toUser">The recipient's username.</param>
        /// <param name="message">The private message content.</param>
        /// <returns>A Task representing the asynchronous operation.</returns>
        public async Task SendPrivateMessage(string toUser, string message)
        {
            if (string.IsNullOrWhiteSpace(toUser) || string.IsNullOrWhiteSpace(message))
            {
                return; // Do nothing if no recipient or message
            }

            var recipient = ConnectedUsers.FirstOrDefault(u => u.Value == toUser);
            var senderUsername = ConnectedUsers[Context.ConnectionId];

            if (!string.IsNullOrEmpty(recipient.Key))
            {
                // Send message to the recipient
                await Clients.Client(recipient.Key).SendAsync("ReceivePrivateMessage", senderUsername, message);

                // Also send a copy to the sender for confirmation
                await Clients.Caller.SendAsync("ReceivePrivateMessage", "To " + toUser, message);
            }
        }

        /// <summary>
        /// Sends the list of currently connected users to the caller.
        /// </summary>
        /// <returns>A Task representing the asynchronous operation.</returns>
        public async Task GetConnectedUsers()
        {
            // Send the list of connected users to the requesting client
            await Clients.Caller.SendAsync("ConnectedUsersList", ConnectedUsers.Values);
        }
    }
}
