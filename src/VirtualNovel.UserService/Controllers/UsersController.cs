using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VirtualNovel.IdentityService.Dto.Request;
using VirtualNovel.IdentityService.Interfaces;

namespace VirtualNovel.IdentityService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController 
    (IUserProfileService userProfileService): ControllerBase
{
    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetMeAsync(CancellationToken cancellationToken = default)
    {
        var user = await userProfileService.GetMe(cancellationToken);
        return user is null ? NotFound() : Ok(user);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(
        string id,
        CancellationToken cancellationToken = default)
    {
        var profile = await userProfileService.GetUserAsync(id, cancellationToken);
        return profile is null ? NotFound() : Ok(profile);
    }
    
    [Authorize]
    [HttpPut]
    public async Task<IActionResult> UpdateUser(
        UpdateUserProfileRequest request,
        CancellationToken cancellationToken = default)
    {
        var profile = await userProfileService.UpdateUserAsync(
            request,
            cancellationToken);

        return profile is null ? Forbid() : Ok(profile);
    }

    [HttpGet("author/{id}")]
    public async Task<IActionResult> GetAuthor(string id, CancellationToken cancellationToken = default)
    {
        var author = await userProfileService.GetAuthorPreviewAsync(
            id,
            cancellationToken);

        return author is null ? NotFound() : Ok(author);
    }
}
