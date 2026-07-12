namespace VirtualNovel.NovelService.Entities;

public sealed class Chapter
{
    public Guid Id { get; set; }

    public Guid NovelId { get; set; }

    public Novel Novel { get; set; } = null!;

    public int Order { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public required string Content { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}