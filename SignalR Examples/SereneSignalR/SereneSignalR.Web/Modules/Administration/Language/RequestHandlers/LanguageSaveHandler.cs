using MyRow = SereneSignalR.Administration.LanguageRow;
using MyRequest = Serenity.Services.SaveRequest<SereneSignalR.Administration.LanguageRow>;
using MyResponse = Serenity.Services.SaveResponse;


namespace SereneSignalR.Administration;

public interface ILanguageSaveHandler : ISaveHandler<MyRow, MyRequest, MyResponse> { }
public class LanguageSaveHandler : SaveRequestHandler<MyRow, MyRequest, MyResponse>, ILanguageSaveHandler
{
    public LanguageSaveHandler(IRequestContext context)
         : base(context)
    {
    }
}