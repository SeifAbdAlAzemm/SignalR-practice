using MyRow = SereneSignalR.Administration.UserRow;
using MyRequest = SereneSignalR.Administration.UserListRequest;
using MyResponse = Serenity.Services.ListResponse<SereneSignalR.Administration.UserRow>;

namespace SereneSignalR.Administration;

public interface IUserListHandler : IListHandler<MyRow, MyRequest, MyResponse> { }

public class UserListHandler : ListRequestHandler<MyRow, MyRequest, MyResponse>, IUserListHandler
{
    public UserListHandler(IRequestContext context)
         : base(context)
    {
    }
}