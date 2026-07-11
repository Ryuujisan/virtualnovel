namespace VirtualNovel.Contracts.Events;

public sealed record NovelCreatedEvent(
    Guid NovelId,
    string AuthorId,
    string Title,
    DateTimeOffset CreatedAt);