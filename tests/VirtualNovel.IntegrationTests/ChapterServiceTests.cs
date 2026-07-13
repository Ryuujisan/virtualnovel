using System.Net;
using System.Net.Http.Json;
using VirtualNovel.IntegrationTests.Infrastructure;
using VirtualNovel.NovelService.Dto.Models;
using VirtualNovel.NovelService.Dto.Models.Novels;
using VirtualNovel.NovelService.Dto.Requests;

namespace VirtualNovel.IntegrationTests;

public sealed class ChapterServiceTests(NovelServiceFactory factory)
    : IClassFixture<NovelServiceFactory>
{
    [Fact]
    public async Task Create_And_Get_Chapter_By_Id_And_Order()
    {
        var created = await NovelTestData.CreateNovelAsync(factory);
        var chapter = await CreateChapterAsync(created, "First chapter");
        using var anonymousClient = factory.CreateClient();

        var byId = await anonymousClient.GetFromJsonAsync<ChapterDto>(
            $"api/chapters/{chapter.Id}");
        var byOrder = await anonymousClient.GetFromJsonAsync<ChapterDto>(
            $"api/novels/{created.Novel.Id}/chapters/1");

        Assert.NotNull(byId);
        Assert.NotNull(byOrder);
        Assert.Equal("First chapter", byId.Title);
        Assert.Equal(byId, byOrder);
    }

    [Fact]
    public async Task Update_Chapter_Order_Reorders_All_Chapters()
    {
        var created = await NovelTestData.CreateNovelAsync(factory);
        var first = await CreateChapterAsync(created, "First");
        var second = await CreateChapterAsync(created, "Second");
        var third = await CreateChapterAsync(created, "Third");
        var request = new UpdateChapterRequest(
            third.Id,
            "Third updated",
            "Updated description",
            "Updated content",
            1);

        var response = await created.Client.PutAsJsonAsync("api/chapters", request);
        response.EnsureSuccessStatusCode();
        var novel = await created.Client.GetFromJsonAsync<NovelDto>(
            $"api/novels/{created.Novel.Id}");
        var orderedIds = novel!.Chapters.OrderBy(chapter => chapter.Order)
            .Select(chapter => chapter.Id)
            .ToArray();

        Assert.Equal([third.Id, first.Id, second.Id], orderedIds);
    }

    [Fact]
    public async Task Delete_Chapter_Closes_Order_Gap()
    {
        var created = await NovelTestData.CreateNovelAsync(factory);
        await CreateChapterAsync(created, "First");
        var second = await CreateChapterAsync(created, "Second");
        var third = await CreateChapterAsync(created, "Third");

        var deleteResponse = await created.Client.DeleteAsync(
            $"api/chapters?chapterId={second.Id}");
        var novel = await created.Client.GetFromJsonAsync<NovelDto>(
            $"api/novels/{created.Novel.Id}");
        var remaining = novel!.Chapters.OrderBy(chapter => chapter.Order).ToArray();

        Assert.Equal(HttpStatusCode.OK, deleteResponse.StatusCode);
        Assert.Equal(2, remaining.Length);
        Assert.Equal(third.Id, remaining[1].Id);
        Assert.Equal(2, remaining[1].Order);
    }

    [Fact]
    public async Task Create_Chapter_Requires_Authorization()
    {
        var created = await NovelTestData.CreateNovelAsync(factory);
        using var anonymousClient = factory.CreateClient();
        var request = new CreateChapterRequest(
            created.Novel.Id,
            "Unauthorized chapter",
            "Description",
            "Content");

        var response = await anonymousClient.PostAsJsonAsync("api/chapters", request);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    private static async Task<ChapterFeedDto> CreateChapterAsync(
        CreatedNovel created,
        string title)
    {
        var request = new CreateChapterRequest(
            created.Novel.Id,
            title,
            $"Description for {title}",
            $"Content for {title}");
        var response = await created.Client.PostAsJsonAsync("api/chapters", request);
        response.EnsureSuccessStatusCode();
        var novel = await created.Client.GetFromJsonAsync<NovelDto>(
            $"api/novels/{created.Novel.Id}");

        return novel!.Chapters.Single(chapter => chapter.Title == title);
    }
}
