using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace VirtualNovel.BuildingBlocks.Authentication;

public sealed class CurrentUser(
    IHttpContextAccessor httpContextAccessor)
    : ICurrentUser
{
    private ClaimsPrincipal? Principal =>
        httpContextAccessor.HttpContext?.User;

    public bool IsAuthenticated =>
        Principal?.Identity?.IsAuthenticated == true;

    public string FirebaseUid =>
        Principal?.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? Principal?.FindFirstValue("user_id")
        ?? Principal?.FindFirstValue("sub")
        ?? throw new UnauthorizedAccessException(
            "User identifier claim is missing.");
}