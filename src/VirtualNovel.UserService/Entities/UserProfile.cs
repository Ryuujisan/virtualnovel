namespace VirtualNovel.IdentityService.Entities;

public sealed class UserProfile
{
    public Guid Id { get; set; }
    public string FirebaseUid { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}