using VirtualNovel.NovelService.Dto.Models.Novels;

namespace VirtualNovel.NovelService.Services;

public interface IUserServiceClient
{
    Task<AuthorPreviewDto?> GetAuthorPreviewAsync(
        string authorId,
        CancellationToken cancellationToken);
}