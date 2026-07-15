namespace VirtualNovel.IdentityService.Entities;

public enum EGender
{
    None,
    Male,
    Female
}
public sealed class UserProfile
{
    public Guid Id { get; set; }
    public string FirebaseUid { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public EGender Gender { get; set; }
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}