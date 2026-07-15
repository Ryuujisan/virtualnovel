using VirtualNovel.IdentityService.Dto.Models;
using VirtualNovel.IdentityService.Dto.Request;

namespace VirtualNovel.IdentityService.Interfaces;


public interface IUserProfileService
{
    Task<UserProfileDto?> GetMe(CancellationToken cancellationToken = default);
    Task<UserProfileDto?> GetUserAsync(
        string firebaseUid,
        CancellationToken cancellationToken = default);

    Task<AuthorPreviewDto?> GetAuthorPreviewAsync(
        string firebaseUid,
        CancellationToken cancellationToken = default);

    Task<UserProfileDto?> UpdateUserAsync(
        UpdateUserProfileRequest request,
        CancellationToken cancellationToken = default);
}
