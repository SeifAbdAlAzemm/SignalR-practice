using SignalRWebpack.Hubs;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSignalR();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

//app.MapGet("/", () => "Hello World!");
app.MapHub<ChatHub>("/hub");

app.Run();
