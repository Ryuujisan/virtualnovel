using VirtualNovel.IdentityService.Entities;

namespace VirtualNovel.IdentityService.Dto.Models;

public record UserProfileDto(
    string FirebaseUid,
    string? DisplayName,
    EGender Gender,
    string? Bio,
    string? AvatarUrl,
    DateTime? CreatedAt,
    DateTime? UpdatedAt);

public record AuthorPreviewDto(
    string AuthorId,
    string Name,
    string? AvatarUrl);
    
