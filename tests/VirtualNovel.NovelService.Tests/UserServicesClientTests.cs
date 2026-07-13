using System.Net;
using System.Net.Http.Json;
using VirtualNovel.NovelService.Dto.Models.Novels;
using VirtualNovel.NovelService.Services;

namespace VirtualNovel.NovelService.Tests;

public sealed class UserServicesClientTests
{
    [Fact]
    public async Task GetAuthorPreviewAsync_Returns_Deserialized_Author()
    {
        Uri? requestedUri = null;
        using var httpClient = CreateHttpClient((request, _) =>
        {
            requestedUri = request.RequestUri;
            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = JsonContent.Create(new AuthorPreviewDto(
                    "author-1",
                    "Mira North",
                    "https://example.com/avatar.png"))
            });
        });
        var client = new UserServicesClient(httpClient);

        var result = await client.GetAuthorPreviewAsync(
            "author-1",
            CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal("author-1", result.AuthorId);
        Assert.Equal("Mira North", result.Name);
        Assert.Equal("https://example.com/avatar.png", result.AvatarUrl);
        Assert.Equal(
            "http://users.test/api/users/author/author-1",
            requestedUri?.ToString());
    }

    [Fact]
    public async Task GetAuthorPreviewAsync_Returns_Null_For_NotFound()
    {
        using var httpClient = CreateHttpClient((_, _) => Task.FromResult(
            new HttpResponseMessage(HttpStatusCode.NotFound)));
        var client = new UserServicesClient(httpClient);

        var result = await client.GetAuthorPreviewAsync(
            "missing-author",
            CancellationToken.None);

        Assert.Null(result);
    }

    [Fact]
    public async Task GetAuthorPreviewAsync_Throws_For_Server_Error()
    {
        using var httpClient = CreateHttpClient((_, _) => Task.FromResult(
            new HttpResponseMessage(HttpStatusCode.InternalServerError)));
        var client = new UserServicesClient(httpClient);

        await Assert.ThrowsAsync<HttpRequestException>(() =>
            client.GetAuthorPreviewAsync(
                "author-1",
                CancellationToken.None));
    }

    [Fact]
    public async Task GetAuthorPreviewAsync_Passes_CancellationToken()
    {
        using var httpClient = CreateHttpClient(async (_, cancellationToken) =>
        {
            await Task.Delay(Timeout.InfiniteTimeSpan, cancellationToken);
            return new HttpResponseMessage(HttpStatusCode.OK);
        });
        var client = new UserServicesClient(httpClient);
        using var cancellation = new CancellationTokenSource();
        cancellation.Cancel();

        await Assert.ThrowsAnyAsync<OperationCanceledException>(() =>
            client.GetAuthorPreviewAsync(
                "author-1",
                cancellation.Token));
    }

    private static HttpClient CreateHttpClient(
        Func<HttpRequestMessage, CancellationToken, Task<HttpResponseMessage>> response) =>
        new(new StubHttpMessageHandler(response))
        {
            BaseAddress = new Uri("http://users.test/")
        };

    private sealed class StubHttpMessageHandler(
        Func<HttpRequestMessage, CancellationToken, Task<HttpResponseMessage>> response)
        : HttpMessageHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken) =>
            response(request, cancellationToken);
    }
}
