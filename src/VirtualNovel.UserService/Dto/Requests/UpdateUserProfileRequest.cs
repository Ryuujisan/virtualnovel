using VirtualNovel.IdentityService.Entities;

namespace VirtualNovel.IdentityService.Dto.Request;

public record UpdateUserProfileRequest(
    string Name,
    string? Bio = null,
    EGender Gender = EGender.None,
    string? AvatarUrl = null);
