using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using VirtualNovel.IdentityService.Dto.Models;
using VirtualNovel.IdentityService.Dto.Request;
using VirtualNovel.IdentityService.Infrastructure.Database;

namespace VirtualNovel.IntegrationTests;

public sealed class UserServiceTests(UserServiceFactory factory)
    : IClassFixture<UserServiceFactory>
{
    private async Task<HttpClient> CreateAuthenticatedClient()
    {
        await using var scope = factory.Services.CreateAsyncScope();

        var firebase =
            scope.ServiceProvider.GetRequiredService<FirebaseTokenGenerator>();

        var token = await firebase.GetIdTokenAsync();

        var client = factory.CreateClient();

        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        return client;
    }
    
    [Fact]
    public async Task Temporary_database_is_available()
    {
        await using var scope = factory.Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<UserDbContext>();

        Assert.True(await dbContext.Database.CanConnectAsync());
    }

    [Fact]
    public async Task User_Me_Endpoint()
    {
        await using var scope = factory.Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<UserDbContext>();
        var client = await CreateAuthenticatedClient();
        var meDto = await client.GetAsync("api/Users/me");
        Assert.True(meDto.IsSuccessStatusCode);
    }
    
    [Fact]
    public async Task User_Update_Endpoint()
    {
        await using var scope = factory.Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<UserDbContext>();
         var client = await CreateAuthenticatedClient();
         await client.GetAsync("api/Users/me");
         var reqData = new UpdateUserProfileRequest("Test_Check", "Random bio", "");
         
         await client.PutAsJsonAsync("api/Users/me", reqData);

         var response = await client.GetFromJsonAsync<UserProfileDto>(
             "api/Users/me");

         Assert.NotNull(response);
         Assert.Equal("Test_Check", response.DisplayName);
         Assert.Equal("Random bio", response.Bio);
    }
}
