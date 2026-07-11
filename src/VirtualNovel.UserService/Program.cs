using VirtualNovel.BuildingBlocks.Authentication;
using VirtualNovel.BuildingBlocks.Database;
using VirtualNovel.IdentityService.Infrastructure.Database;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddFirebaseAuthentication(builder.Configuration);
builder.Services.AddPostgres<UserDbContext>(builder.Configuration);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

var app = builder.Build();

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