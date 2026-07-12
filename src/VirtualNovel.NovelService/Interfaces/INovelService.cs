using VirtualNovel.NovelService.Dto.Models.Novels;
using VirtualNovel.NovelService.Dto.Requests;
using VirtualNovel.NovelService.Entities;

namespace VirtualNovel.NovelService.Services;

public interface INovelService
{
    public Task<IReadOnlyCollection<NovelFeedDto>> GetNovelFeed(CancellationToken cancellationToken = default);
    public Task<IReadOnlyCollection<NovelFeedDto>> GetFilteredNovelFeed(ICollection<EGenre> genres, ERomanceType romanceType = ERomanceType.None, CancellationToken cancellationToken = default);
    public Task<IReadOnlyCollection<NovelFeedDto>> GetNovelsByAuthor(string authorId, CancellationToken cancellationToken = default);
    public Task<NovelDto?> GetNovel(Guid novelId, CancellationToken cancellationToken = default);
    public Task<NovelDto?> CreateNovel(CreateNovelRequest request, CancellationToken cancellationToken = default);
    public Task<NovelDto?> UpdateNovel(UpdateNovelRequest request, CancellationToken cancellationToken = default);
    public Task<bool> DeleteNovel(Guid id, CancellationToken cancellationToken = default);
}
