using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace SereneSignalR.Modules.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string message)
        {
            string username = Context.User?.Identity?.Name ?? "Anonymous";
            await Clients.All.SendAsync("ReceiveMessage", username, message);
        }
    }
}
