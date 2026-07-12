using VirtualNovel.BuildingBlocks.Authentication;
using VirtualNovel.BuildingBlocks.Database;
using VirtualNovel.NovelService.Infrastructure.Database;
using VirtualNovel.NovelService.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddAutoMapper(_ => { }, typeof(Program).Assembly);
builder.Services.AddPostgres<NovelDbContext>(builder.Configuration);
builder.Services.AddFirebaseAuthentication(builder.Configuration, builder.Environment);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddScoped<INovelService, NovelServices>();
builder.Services.AddScoped<IChapterServices, ChapterServices>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    await NovelDbSeeder.SeedAsync(app.Services);
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

