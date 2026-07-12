using Microsoft.EntityFrameworkCore;
using VirtualNovel.BuildingBlocks.Authentication;
using VirtualNovel.IdentityService.Dto.Models;
using VirtualNovel.IdentityService.Dto.Request;
using VirtualNovel.IdentityService.Entities;
using VirtualNovel.IdentityService.Infrastructure.Database;
using VirtualNovel.IdentityService.Interfaces;

namespace VirtualNovel.IdentityService.Services;

public sealed class UserProfileService(
    UserDbContext dbContext,
    ICurrentUser currentUser) : IUserProfileService
{
    public async Task<UserProfileDto?> GetUserAsync(
        string firebaseUid,
        CancellationToken cancellationToken = default)
    {
        var user = await dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(
                user => user.FirebaseUid == firebaseUid,
                cancellationToken);

        return user is null ? null : MapToDto(user);
    }

    public async Task<UserProfileDto?> UpdateUserAsync(
        string firebaseUid,
        UpdateUserProfileRequest request,
        CancellationToken cancellationToken = default)
    {
        if (!string.Equals(
                currentUser.FirebaseUid,
                firebaseUid,
                StringComparison.Ordinal))
        {
            return null;
        }

        var user = await GetOrCreateCurrentUserAsync(cancellationToken);

        var anyChanges = false;

        if (user.DisplayName != request.Name)
        {
            user.DisplayName = request.Name;
            anyChanges = true;
        }

        if (user.Bio != request.Bio)
        {
            user.Bio = request.Bio;
            anyChanges = true;
        }

        // Avatar najlepiej obsłużyć osobnym endpointem,
        // np. PUT /users/me/avatar.
        // Cloudinary zwróci URL, który zapiszesz tutaj.
        
        if (anyChanges)
        {
            user.UpdatedAt = DateTime.UtcNow;
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        return MapToDto(user);
    }

    private async Task<UserProfile> GetOrCreateCurrentUserAsync(
        CancellationToken cancellationToken)
    {
        var firebaseUid = currentUser.FirebaseUid;

        if (string.IsNullOrWhiteSpace(firebaseUid))
        {
            throw new UnauthorizedAccessException(
                "Firebase user identifier is missing.");
        }

        var user = await dbContext.Users.FirstOrDefaultAsync(
            user => user.FirebaseUid == firebaseUid,
            cancellationToken);

        if (user is not null)
        {
            return user;
        }

        var now = DateTime.UtcNow;

        user = new UserProfile
        {
            FirebaseUid = firebaseUid,
            CreatedAt = now,
            UpdatedAt = now
        };

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync(cancellationToken);

        return user;
    }

    private static UserProfileDto MapToDto(UserProfile user)
    {
        return new UserProfileDto(
            user.FirebaseUid,
            user.DisplayName,
            user.Bio,
            user.AvatarUrl,
            user.CreatedAt,
            user.UpdatedAt);
    }
}
