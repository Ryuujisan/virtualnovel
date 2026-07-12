using VirtualNovel.NovelService.Entities;

namespace VirtualNovel.NovelService.Dto.Requests;

public record UpdateNovelRequest(
    Guid NovelId,
    string Name,
    string Description,
    string Url,
    string CoverUrl,
    EGenre[] Genres,
    EWorkType WorkType,
    ERomanceType RomanceType);