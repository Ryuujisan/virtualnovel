using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using VirtualNovel.IdentityService.Dto.Models;
using VirtualNovel.IdentityService.Dto.Request;
using VirtualNovel.IdentityService.Infrastructure.Database;
using VirtualNovel.IntegrationTests.Infrastructure;

namespace VirtualNovel.IntegrationTests;

public sealed class UserServiceTests(UserServiceFactory factory)
    : IClassFixture<UserServiceFactory>
{
    [Fact]
    public async Task Temporary_database_is_available()
    {
        await using var scope = factory.Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<UserDbContext>();

        Assert.True(await dbContext.Database.CanConnectAsync());
    }

    [Fact]
    public async Task Get_User_Endpoint_Is_Available_Anonymously()
    {
        var (client, session) = await factory.CreateAuthenticatedClientAsync();
        var request = new UpdateUserProfileRequest("Test user", "", "");
        var updateResponse = await client.PutAsJsonAsync(
            $"api/Users/{session.UserId}",
            request);
        updateResponse.EnsureSuccessStatusCode();

        client.DefaultRequestHeaders.Authorization = null;
        var response = await client.GetAsync($"api/Users/{session.UserId}");

        Assert.True(response.IsSuccessStatusCode);
    }
    
    [Fact]
    public async Task Update_User_Endpoint_Updates_Current_User()
    {
         var (client, session) = await factory.CreateAuthenticatedClientAsync();
         var reqData = new UpdateUserProfileRequest("Test_Check", "Random bio", "");
         
         var updateResponse = await client.PutAsJsonAsync(
             $"api/Users/{session.UserId}",
             reqData);
         updateResponse.EnsureSuccessStatusCode();

         var response = await client.GetFromJsonAsync<UserProfileDto>(
             $"api/Users/{session.UserId}");

         Assert.NotNull(response);
         Assert.Equal("Test_Check", response.DisplayName);
         Assert.Equal("Random bio", response.Bio);
    }

    [Fact]
    public async Task Get_Unknown_User_Returns_NotFound()
    {
        using var client = factory.CreateClient();

        var response = await client.GetAsync("api/users/unknown-user-id");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Get_Author_Returns_Public_Preview()
    {
        var (client, session) = await factory.CreateAuthenticatedClientAsync();
        var request = new UpdateUserProfileRequest(
            "Public author",
            "Private profile fields are not needed in a novel response.",
            "");
        var updateResponse = await client.PutAsJsonAsync(
            $"api/users/{session.UserId}",
            request);
        updateResponse.EnsureSuccessStatusCode();

        client.DefaultRequestHeaders.Authorization = null;
        var author = await client.GetFromJsonAsync<AuthorPreviewDto>(
            $"api/users/author/{session.UserId}");

        Assert.NotNull(author);
        Assert.Equal(session.UserId, author.AuthorId);
        Assert.Equal("Public author", author.Name);
        Assert.Null(author.AvatarUrl);
    }

    [Fact]
    public async Task Get_Unknown_Author_Returns_NotFound()
    {
        using var client = factory.CreateClient();

        var response = await client.GetAsync(
            "api/users/author/unknown-author-id");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Update_User_Requires_Authorization()
    {
        using var client = factory.CreateClient();
        var request = new UpdateUserProfileRequest("Name", "Bio", "");

        var response = await client.PutAsJsonAsync("api/users/user-id", request);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task User_Cannot_Update_Another_Profile()
    {
        var (client, _) = await factory.CreateAuthenticatedClientAsync();
        var request = new UpdateUserProfileRequest("Name", "Bio", "");

        var response = await client.PutAsJsonAsync(
            "api/users/different-user-id",
            request);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

}
