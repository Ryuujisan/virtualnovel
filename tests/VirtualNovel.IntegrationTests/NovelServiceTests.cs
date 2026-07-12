using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using VirtualNovel.IntegrationTests.Infrastructure;
using VirtualNovel.NovelService.Dto.Models.Novels;
using VirtualNovel.NovelService.Dto.Requests;
using VirtualNovel.NovelService.Entities;
using VirtualNovel.NovelService.Infrastructure.Database;

namespace VirtualNovel.IntegrationTests;

public sealed class NovelServiceTests(NovelServiceFactory factory)
    : IClassFixture<NovelServiceFactory>
{
    [Fact]
    public async Task Temporary_database_is_available()
    {
        await using var scope = factory.Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<NovelDbContext>();

        Assert.True(await dbContext.Database.CanConnectAsync());
    }

    [Fact]
    public async Task Get_Novel_Feed_Is_Available_Anonymously()
    {
        using var client = factory.CreateClient();

        var response = await client.GetAsync("api/novels");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Create_Novel_Endpoint_Creates_Novel_For_Current_User()
    {
        var (client, session) = await factory.CreateAuthenticatedClientAsync();
        var request = new CreateNovelRequest(
            "Miasto pod szklanym niebem",
            "Badaczka pogody odkrywa, że burze nad miastem są wiadomościami.",
            "https://example.com/covers/glass-sky.jpg",
            ERomanceType.Yuri,
            [EGenre.Fantasy, EGenre.Mystery],
            EWorkType.Original);

        var response = await client.PostAsJsonAsync("api/novels", request);
        response.EnsureSuccessStatusCode();
        var novel = await response.Content.ReadFromJsonAsync<NovelDto>();

        Assert.NotNull(novel);
        Assert.Equal(session.UserId, novel.AuthorId);
        Assert.Equal(request.Name, novel.Title);
        Assert.Equal(request.WorkType, novel.WorkType);
    }

    [Fact]
    public async Task Create_Novel_Endpoint_Requires_Authorization()
    {
        using var client = factory.CreateClient();
        var request = new CreateNovelRequest(
            "Unauthorized novel",
            "This request should not create a novel.",
            "https://example.com/cover.jpg",
            ERomanceType.None,
            [EGenre.Drama],
            EWorkType.Original);

        var response = await client.PostAsJsonAsync("api/novels", request);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    private async Task<NovelDto> CreateNovelAsync()
    {
        var (client, session) = await factory.CreateAuthenticatedClientAsync();
        var request = new CreateNovelRequest(
            "Miasto pod szklanym niebem",
            "Badaczka pogody odkrywa, że burze nad miastem są wiadomościami.",
            "https://example.com/covers/glass-sky.jpg",
            ERomanceType.Yuri,
            [EGenre.Fantasy, EGenre.Mystery],
            EWorkType.Original);

        var response = await client.PostAsJsonAsync("api/novels", request);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<NovelDto>();
    }


    [Fact]
    private async Task Get_Novel_Feed_Is_Available()
    {
        await CreateNovelAsync();
        using var client = factory.CreateClient();
        var response = await client.GetAsync("api/novels");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
