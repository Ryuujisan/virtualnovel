namespace VirtualNovel.NovelService.Entities;

[System.Text.Json.Serialization.JsonConverter(typeof(System.Text.Json.Serialization.JsonStringEnumConverter))]
public enum EStatus
{
    Publishing,
    Complete,
    Hiatus,
    Abandoned
}
[System.Text.Json.Serialization.JsonConverter(typeof(System.Text.Json.Serialization.JsonStringEnumConverter))]
public enum ERomanceType
{
    None = 0,
    Hetero = 1,
    Yuri = 2,
    Yaoi = 3,
    Mixed = 4
}
[System.Text.Json.Serialization.JsonConverter(typeof(System.Text.Json.Serialization.JsonStringEnumConverter))]
public enum EGenre
{
    Action,
    Adventure,
    Comedy,
    Drama,
    Fantasy,
    Harem,
    Romance,
    SliceOfLife,
    Supernatural,
    School,
    SciFi,

    Mystery,
    Horror,
    Psychological,
    Isekai,
    MartialArts
}
[System.Text.Json.Serialization.JsonConverter(typeof(System.Text.Json.Serialization.JsonStringEnumConverter))]
public enum EWorkType
{
    Original = 0,
    Fanfiction = 1
}
public sealed class Novel
{
    public Guid Id { get; set; }
    public required string AuthorId { get; set; } 
    public required string Name { get; set; }
    public required string Description { get; set; }
    public string? CoverUrl { get; set; }
    public EStatus Status { get; set; }
    public ERomanceType RomanceType { get; set; }
    public EWorkType WorkType { get; set; }
    public ICollection<EGenre> Genres { get; set; } = new List<EGenre>();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public ICollection<Chapter> Chapters { get; set; }
        = new List<Chapter>();

    public ICollection<Rating> Ratings { get; set; }
        = new List<Rating>();
}
