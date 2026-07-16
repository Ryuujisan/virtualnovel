using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VirtualNovel.ImageService.Dto.Request;
using VirtualNovel.ImageService.Interfaces;

namespace VirtualNovel.ImageService.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ImagesController
    (IImageServices imageServices): ControllerBase
{
    [Authorize]
    [HttpPut]
    public async Task<ActionResult<UploadImageResponse>> UploadImage(
        [FromBody] UploadFileRequest request,
        CancellationToken cancellationToken)
    {
        var result = await imageServices.UploadImage(request, cancellationToken);
        return Ok(result);
    }
}
