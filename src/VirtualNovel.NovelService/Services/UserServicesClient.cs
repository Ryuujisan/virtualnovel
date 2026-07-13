using System.Net;
using System.Net.Http.Json;
using VirtualNovel.NovelService.Dto.Models.Novels;

namespace VirtualNovel.NovelService.Services;

public sealed class UserServicesClient(HttpClient http) : IUserServiceClient
{
    public async Task<AuthorPreviewDto?> GetAuthorPreviewAsync(
        string authorId,
        CancellationToken cancellationToken)
    {
        var encodedAuthorId = Uri.EscapeDataString(authorId);
        using var response = await http.GetAsync(
            $"api/users/author/{encodedAuthorId}",
            cancellationToken);

        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            return null;
        }

        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<AuthorPreviewDto>(
            cancellationToken: cancellationToken);
    }
}
