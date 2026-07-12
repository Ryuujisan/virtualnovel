namespace VirtualNovel.NovelService.Entities;

public class Rating
{
    public Guid Id { get; set; }
    public required string UserId { get; set; }
    public Guid NovelId { get; set; }

    public Novel Novel { get; set; } = null!;
    public float Rate { get; set; }
}
