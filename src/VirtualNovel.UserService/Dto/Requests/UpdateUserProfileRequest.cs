namespace VirtualNovel.IdentityService.Dto.Request;

public record UpdateUserProfileRequest(string Name, string Bio, string AvatarRaw);