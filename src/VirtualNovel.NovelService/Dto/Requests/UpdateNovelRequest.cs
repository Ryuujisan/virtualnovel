using VirtualNovel.NovelService.Entities;

namespace VirtualNovel.NovelService.Dto.Requests;

public record UpdateNovelRequest(
    Guid NovelId,
    string? Name = null,
    string? Description = null,
    string? Url = null,
    string? CoverUrl = null,
    EGenre[]? Genres = null,
    EWorkType? WorkType = null,
    ERomanceType? RomanceType = null,
    EStatus? Status = null,
    bool RemoveCover = false);
