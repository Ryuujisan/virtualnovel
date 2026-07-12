using VirtualNovel.NovelService.Entities;

namespace VirtualNovel.NovelService.Dto.Models.Novels;

public record NovelDto(
    Guid Id,
    string AuthorId,
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