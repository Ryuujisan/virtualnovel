namespace VirtualNovel.NovelService.Dto.Requests;

public record ReorderChapterRequest(Guid ChapterId, int NewOrder);
