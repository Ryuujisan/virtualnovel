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
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(
        string id,
        CancellationToken cancellationToken = default)
    {
        var profile = await userProfileService.GetUserAsync(id, cancellationToken);
        return profile is null ? NotFound() : Ok(profile);
    }
    
    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(
        string id,
        UpdateUserProfileRequest request,
        CancellationToken cancellationToken = default)
    {
        var profile = await userProfileService.UpdateUserAsync(
            id,
            request,
            cancellationToken);

        return profile is null ? Forbid() : Ok(profile);
    }
}
