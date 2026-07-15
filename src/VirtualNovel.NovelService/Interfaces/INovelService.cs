using VirtualNovel.NovelService.Dto.Models.Novels;
using VirtualNovel.NovelService.Dto.Requests;
using VirtualNovel.NovelService.Entities;

namespace VirtualNovel.NovelService.Services;

public interface INovelService
{
    public Task<IReadOnlyCollection<NovelFeedDto>> GetNovelFeed(
        ICollection<EGenre> genres,
        ERomanceType romanceType,
        string? author,
        EStatus? status,
        int? minChapters = null,
        int? maxChapters = null,
        string sortBy = "updatedAt",
        bool descending = true,
        int page = 1,
        int pageSize = 20,
        CancellationToken cancellationToken = default);
    public Task<IReadOnlyCollection<NovelFeedDto>> GetNovelsByAuthor(string authorId, CancellationToken cancellationToken = default);
    public Task<NovelDto?> GetNovel(Guid novelId, CancellationToken cancellationToken = default);
    public Task<NovelDto?> CreateNovel(CreateNovelRequest request, CancellationToken cancellationToken = default);
    public Task<NovelDto?> UpdateNovel(UpdateNovelRequest request, CancellationToken cancellationToken = default);
    public Task<bool> DeleteNovel(Guid id, CancellationToken cancellationToken = default);
}
