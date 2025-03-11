using Microsoft.AspNetCore.Mvc;
using Serenity.Web;

namespace SereneSignalR.Modules.Chat
{
    [PageAuthorize]
    [Route("Chat")]
    public class ChatPage : Controller
    {
        public ActionResult Index()
        {
            return View("~/Modules/Chat/ChatIndex.cshtml");
        }
    }
}
