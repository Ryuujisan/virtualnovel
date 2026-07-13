using VirtualNovel.NovelService.Entities;

namespace VirtualNovel.NovelService.Dto.Models.Novels;

public record NovelFeedDto(
    Guid Id,
    string Title,
    string Description,
    string? CoverUrl,
    float Rating,
    EStatus Status,
    ERomanceType Romance,
    IReadOnlyCollection<EGenre> Genres,
    DateTime UpdatedAt);
