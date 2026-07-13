using System.Net.Http.Json;
using VirtualNovel.NovelService.Dto.Models.Novels;
using VirtualNovel.NovelService.Dto.Requests;
using VirtualNovel.NovelService.Entities;

namespace VirtualNovel.IntegrationTests.Infrastructure;

public static class NovelTestData
{
    public static async Task<CreatedNovel> CreateNovelAsync(
        NovelServiceFactory factory,
        string? title = null)
    {
        var authenticatedClient = await factory.CreateAuthenticatedClientAsync();
        var request = new CreateNovelRequest(
            title ?? $"Test novel {Guid.NewGuid():N}",
            "Badaczka pogody odkrywa, że burze nad miastem są zaszyfrowanymi wiadomościami.",
            "https://example.com/covers/glass-sky.jpg",
            ERomanceType.Yuri,
            [EGenre.Fantasy, EGenre.Mystery],
            EWorkType.Original);

        var response = await authenticatedClient.Client.PostAsJsonAsync(
            "api/novels",
            request);
        response.EnsureSuccessStatusCode();
        var novel = await response.Content.ReadFromJsonAsync<NovelDto>()
            ?? throw new InvalidOperationException("Novel endpoint returned an empty response.");

        return new CreatedNovel(
            authenticatedClient.Client,
            authenticatedClient.Session,
            novel);
    }
}

public sealed record CreatedNovel(
    HttpClient Client,
    FirebaseSession Session,
    NovelDto Novel);
