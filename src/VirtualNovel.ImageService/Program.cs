using Microsoft.AspNetCore.HttpOverrides;
using VirtualNovel.BuildingBlocks.Authentication;
using VirtualNovel.BuildingBlocks.Serialization;
using VirtualNovel.ImageService.Interfaces;
using VirtualNovel.ImageService.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddFirebaseAuthentication(
    builder.Configuration,
    builder.Environment);

builder.Services
    .AddControllers()
    .AddEnumSerialization();

builder.Services.AddScoped<IImageServices, ImageServices>();
builder.Services.AddHealthChecks();

var app = builder.Build();

app.UseForwardedHeaders();

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");

app.Run();

namespace VirtualNovel.ImageService
{
    public sealed class AssemblyMarker;
}
