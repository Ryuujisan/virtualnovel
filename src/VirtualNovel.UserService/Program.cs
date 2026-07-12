using VirtualNovel.BuildingBlocks.Authentication;
using VirtualNovel.BuildingBlocks.Database;
using VirtualNovel.IdentityService.Infrastructure.Database;
using VirtualNovel.IdentityService.Interfaces;
using VirtualNovel.IdentityService.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddFirebaseAuthentication(builder.Configuration, builder.Environment);
builder.Services.AddPostgres<UserDbContext>(builder.Configuration);
builder.Services.AddScoped<IUserProfileService, UserProfileService>();

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    await UserDbSeeder.SeedAsync(app.Services);
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

namespace VirtualNovel.IdentityService
{
    public sealed class AssemblyMarker;
}
