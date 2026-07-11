using Microsoft.AspNetCore.Mvc;
using VirtualNovel.IdentityService.Dto.Request;
using VirtualNovel.IdentityService.Interfaces;

namespace VirtualNovel.IdentityService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController 
    (IUserProfileService userProfileService): ControllerBase
{
    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var profile = await userProfileService.GetCurrentUserAsync();
        return Ok(profile);
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateMe(
        UpdateUserProfileRequest request)
    {
        var profile = await userProfileService.UpdateCurrentUserAsync(request);
        return Ok(profile);
    }
}