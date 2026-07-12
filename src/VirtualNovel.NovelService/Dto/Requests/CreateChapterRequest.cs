namespace VirtualNovel.NovelService.Dto.Requests;

public record CreateChapterRequest(Guid NovelId, string ChapterName, string ChapterDescription, string Content);