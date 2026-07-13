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
    public async Task Get_Novel_Returns_Created_Novel()
    {
        var created = await NovelTestData.CreateNovelAsync(factory);
        using var anonymousClient = factory.CreateClient();

        var novel = await anonymousClient.GetFromJsonAsync<NovelDto>(
            $"api/novels/{created.Novel.Id}");

        Assert.NotNull(novel);
        Assert.Equal(created.Novel.Id, novel.Id);
        Assert.Equal(created.Novel.Title, novel.Title);
    }

    [Fact]
    public async Task Filtered_Feed_Filters_By_Genre_And_Romance_Type()
    {
        var created = await NovelTestData.CreateNovelAsync(factory);
        using var anonymousClient = factory.CreateClient();

        var matching = await anonymousClient.GetFromJsonAsync<List<NovelFeedDto>>(
            "api/novels?genre=Fantasy&type=Yuri");
        var notMatching = await anonymousClient.GetFromJsonAsync<List<NovelFeedDto>>(
            "api/novels?genre=Fantasy&type=Hetero");

        Assert.Contains(matching!, novel => novel.Id == created.Novel.Id);
        Assert.DoesNotContain(notMatching!, novel => novel.Id == created.Novel.Id);
    }

    [Fact]
    public async Task Feed_Sorts_By_UpdatedAt_Descending_And_Applies_Pagination()
    {
        await NovelTestData.CreateNovelAsync(factory, "First paged novel");
        await NovelTestData.CreateNovelAsync(factory, "Second paged novel");
        await NovelTestData.CreateNovelAsync(factory, "Third paged novel");
        using var client = factory.CreateClient();

        var response = await client.GetFromJsonAsync<List<NovelFeedDto>>(
            "api/novels?sort=updatedAt&direction=desc&page=1&pageSize=2");

        Assert.NotNull(response);
        Assert.Equal(2, response.Count);
        Assert.True(response[0].UpdatedAt >= response[1].UpdatedAt);
    }

    [Fact]
    public async Task Feed_Filters_And_Sorts_By_Chapter_Count()
    {
        var oneChapter = await NovelTestData.CreateNovelAsync(factory, "One chapter novel");
        var twoChapters = await NovelTestData.CreateNovelAsync(factory, "Two chapters novel");
        await AddChapterAsync(oneChapter, "Chapter 1");
        await AddChapterAsync(twoChapters, "Chapter 1");
        await AddChapterAsync(twoChapters, "Chapter 2");
        using var client = factory.CreateClient();

        var response = await client.GetFromJsonAsync<List<NovelFeedDto>>(
            "api/novels?minChapters=2&sort=chapterCount&direction=desc");

        Assert.NotNull(response);
        Assert.Contains(response, novel => novel.Id == twoChapters.Novel.Id);
        Assert.DoesNotContain(response, novel => novel.Id == oneChapter.Novel.Id);
    }

    [Fact]
    public async Task Create_Novel_Creates_Novel_For_Current_User()
    {
        var created = await NovelTestData.CreateNovelAsync(factory);

        Assert.Equal(created.Session.UserId, created.Novel.AuthorId);
        Assert.Equal(EWorkType.Original, created.Novel.WorkType);
    }

    [Fact]
    public async Task Update_Novel_Updates_All_Editable_Fields()
    {
        var created = await NovelTestData.CreateNovelAsync(factory);
        var request = new UpdateNovelRequest(
            created.Novel.Id,
            "Updated novel",
            "Updated description",
            "unused-url",
            "https://example.com/updated-cover.jpg",
            [EGenre.SciFi, EGenre.Adventure],
            EWorkType.Fanfiction,
            ERomanceType.Hetero);

        var response = await created.Client.PutAsJsonAsync("api/novels", request);
        response.EnsureSuccessStatusCode();
        var novel = await response.Content.ReadFromJsonAsync<NovelDto>();

        Assert.NotNull(novel);
        Assert.Equal(request.Name, novel.Title);
        Assert.Equal(request.Description, novel.Description);
        Assert.Equal(request.CoverUrl, novel.CoverUrl);
        Assert.Equal(request.WorkType, novel.WorkType);
        Assert.Equal(request.RomanceType, novel.RomanceType);
        Assert.True(request.Genres.ToHashSet().SetEquals(novel.Genres));
    }

    [Fact]
    public async Task Delete_Novel_Removes_Novel()
    {
        var created = await NovelTestData.CreateNovelAsync(factory);
        using var request = new HttpRequestMessage(HttpMethod.Delete, "api/novels")
        {
            Content = JsonContent.Create(created.Novel.Id)
        };

        var deleteResponse = await created.Client.SendAsync(request);
        using var anonymousClient = factory.CreateClient();
        var getResponse = await anonymousClient.GetAsync(
            $"api/novels/{created.Novel.Id}");

        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }

    [Fact]
    public async Task Write_Endpoints_Require_Authorization()
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

    private static async Task AddChapterAsync(CreatedNovel created, string title)
    {
        var request = new CreateChapterRequest(
            created.Novel.Id,
            title,
            $"Description for {title}",
            $"Content for {title}");
        var response = await created.Client.PostAsJsonAsync("api/chapters", request);
        response.EnsureSuccessStatusCode();
    }
}
