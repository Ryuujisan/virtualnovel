using VirtualNovel.NovelService.Entities;

namespace VirtualNovel.NovelService.Dto.Models.Novels;

public record NovelDto(
    Guid Id,
    AuthorPreviewDto Author,
    string Title, 
    string Description, 
    string CoverUrl, 
    float Rating, 
    EStatus Status, 
    ERomanceType RomanceType,
    EWorkType WorkType,
    ICollection<EGenre>  Genres,
    ICollection<ChapterFeedDto> Chapters,
    DateTime CreatedAt, 
    DateTime UpdatedAt);

public record ChapterFeedDto(Guid Id, string Title, int Order);
public record AuthorPreviewDto(string AuthorId, string Name, string? AvatarUrl);
