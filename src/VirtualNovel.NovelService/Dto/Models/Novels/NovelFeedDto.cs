using VirtualNovel.NovelService.Entities;

namespace VirtualNovel.NovelService.Dto.Models.Novels;

public record NovelFeedDto(
    Guid Id,
    string Title,
    string Description,
    string? CoverUrl,
    float Rating,
    EStatus Status,
    DateTime CreatedAt,
    DateTime UpdatedAt);