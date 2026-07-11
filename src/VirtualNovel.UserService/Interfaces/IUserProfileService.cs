using VirtualNovel.IdentityService.Dto.Models;
using VirtualNovel.IdentityService.Dto.Request;

namespace VirtualNovel.IdentityService.Interfaces;


public interface IUserProfileService
{
    Task<UserProfileDto> GetCurrentUserAsync(CancellationToken cancellationToken = default);
    Task<UserProfileDto> UpdateCurrentUserAsync(
        UpdateUserProfileRequest request, CancellationToken cancellationToken = default);
}
