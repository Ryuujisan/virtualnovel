using VirtualNovel.IdentityService.Dto.Models;
using VirtualNovel.IdentityService.Dto.Request;

namespace VirtualNovel.IdentityService.Interfaces;


public interface IUserProfileService
{
    Task<UserProfileDto?> GetUserAsync(
        string firebaseUid,
        CancellationToken cancellationToken = default);

    Task<UserProfileDto?> UpdateUserAsync(
        string firebaseUid,
        UpdateUserProfileRequest request,
        CancellationToken cancellationToken = default);
}
