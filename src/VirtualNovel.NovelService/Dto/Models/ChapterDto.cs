namespace VirtualNovel.NovelService.Dto.Models;

public record ChapterDto(Guid NovelId, string Title, string Content, int Order, DateTime CreatedAt, DateTime UpdatedAt);