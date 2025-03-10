using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace RealTimeChatApp.Pages
{
    public class ChatModel : PageModel
    {
        public string Username { get; set; }

        public void OnGet()
        {
            // Get username from query params
            Username = Request.Query["username"];
        }
    }
}



