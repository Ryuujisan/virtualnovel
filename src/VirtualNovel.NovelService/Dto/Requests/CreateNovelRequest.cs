using VirtualNovel.NovelService.Entities;

namespace VirtualNovel.NovelService.Dto.Requests;

public record CreateNovelRequest(
    string Name, 
    string Description,
    string CoverUrl,
    ERomanceType RomanceType,
    EGenre[] Genres,
    EWorkType WorkType);