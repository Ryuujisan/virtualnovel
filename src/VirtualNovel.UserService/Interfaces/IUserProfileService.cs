using VirtualNovel.IdentityService.Dto.Models;
using VirtualNovel.IdentityService.Dto.Request;

namespace VirtualNovel.IdentityService.Interfaces;


public interface IUserProfileService
{
    Task<UserProfileDto> GetCurrentUserAsync();
    Task<UserProfileDto> UpdateCurrentUserAsync(
        UpdateUserProfileRequest request);
}
