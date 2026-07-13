using Microsoft.EntityFrameworkCore;
using VirtualNovel.BuildingBlocks.Authentication;
using VirtualNovel.BuildingBlocks.Database;
using VirtualNovel.NovelService.Infrastructure.Database;
using VirtualNovel.NovelService.Services;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter());
    });
builder.Services.AddAutoMapper(_ => { }, typeof(Program).Assembly);
builder.Services.AddPostgres<NovelDbContext>(builder.Configuration);
builder.Services.AddFirebaseAuthentication(builder.Configuration, builder.Environment);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddScoped<INovelService, NovelServices>();
builder.Services.AddScoped<IChapterServices, ChapterServices>();
builder.Services.AddHttpClient<IUserServiceClient, UserServicesClient>(
    client =>
    {
        var userServiceUrl = builder.Configuration["Services:UserService"]
            ?? throw new InvalidOperationException(
                "Services:UserService configuration is missing.");

        client.BaseAddress = new Uri(userServiceUrl);
    });
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    await using var scope = app.Services.CreateAsyncScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<NovelDbContext>();
    await dbContext.Database.MigrateAsync();
    await NovelDbSeeder.SeedAsync(app.Services);

    var novelCount = await dbContext.Novels.CountAsync();
    var chapterCount = await dbContext.Chapters.CountAsync();
    app.Logger.LogInformation(
        "Novel database initialized with {NovelCount} novels and {ChapterCount} chapters.",
        novelCount,
        chapterCount);
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    // app.UseSwagger();
    //app.UseSwaggerUI();
}

app.MapControllers();

app.Run();

namespace VirtualNovel.NovelService
{
    public sealed class AssemblyMarker;
}
