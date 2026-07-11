namespace VirtualNovel.IdentityService.Dto.Models;

public record UserProfileDto(
    string FirebaseUid,
    string? DisplayName,
    string? Bio,
    string? AvatarUrl,
    DateTime? CreatedAt,
    DateTime? UpdatedAt);
    