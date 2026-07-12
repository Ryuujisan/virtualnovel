using VirtualNovel.NovelService.Dto.Models;
using VirtualNovel.NovelService.Dto.Requests;

namespace VirtualNovel.NovelService.Services;

public interface IChapterServices
{
    public Task<ChapterDto?> GetChapter(Guid chapterId, CancellationToken cancellationToken = default);
    public Task<ChapterDto?> GetChapter(Guid novelId, int order, CancellationToken cancellationToken = default);
    public Task<ChapterDto?> CreateChapter(CreateChapterRequest request, CancellationToken cancellationToken = default);
    public Task<ChapterDto?> UpdateChapter(UpdateChapterRequest request, CancellationToken cancellationToken = default);
    public Task<bool> DeleteChapter(Guid chapterId, CancellationToken cancellationToken = default);
}
