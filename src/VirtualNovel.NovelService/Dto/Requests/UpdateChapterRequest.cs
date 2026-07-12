namespace VirtualNovel.NovelService.Dto.Requests;

public record UpdateChapterRequest(Guid Id, string ChapterName, string ChapterDescription, string Content, int Order = -1);
