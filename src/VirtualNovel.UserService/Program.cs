using Microsoft.EntityFrameworkCore;
using VirtualNovel.BuildingBlocks.Authentication;
using VirtualNovel.BuildingBlocks.Database;
using VirtualNovel.BuildingBlocks.Serialization;
using VirtualNovel.IdentityService.Infrastructure.Database;
using VirtualNovel.IdentityService.Interfaces;
using VirtualNovel.IdentityService.Services;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddFirebaseAuthentication(builder.Configuration, builder.Environment);
builder.Services.AddPostgres<UserDbContext>(builder.Configuration);
builder.Services.AddScoped<IUserProfileService, UserProfileService>();

builder.Services
    .AddControllers()
    .AddEnumSerialization();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHealthChecks();
//builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseForwardedHeaders();

var applyMigrations = app.Environment.IsDevelopment() ||
    builder.Configuration.GetValue<bool>("Database:ApplyMigrations");

if (applyMigrations)
{
    await using var scope = app.Services.CreateAsyncScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<UserDbContext>();
    await dbContext.Database.MigrateAsync();

    if (app.Environment.IsDevelopment())
    {
        await UserDbSeeder.SeedAsync(app.Services);

        var userCount = await dbContext.Users.CountAsync();
        app.Logger.LogInformation(
            "User database initialized with {UserCount} profiles.",
            userCount);
    }
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
app.MapHealthChecks("/health");

app.Run();

namespace VirtualNovel.IdentityService
{
    public sealed class AssemblyMarker;
}
