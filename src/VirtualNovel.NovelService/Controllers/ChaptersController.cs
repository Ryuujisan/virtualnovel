using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VirtualNovel.NovelService.Dto.Models;
using VirtualNovel.NovelService.Dto.Requests;
using VirtualNovel.NovelService.Services;

namespace VirtualNovel.NovelService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChaptersController(IChapterServices chapter) : ControllerBase
{
    [HttpGet("/api/novels/{novelId:guid}/chapters/{order:int:min(1)}")]
    public async Task<IActionResult> GetChapter(Guid novelId, int order, CancellationToken cancellationToken = default)
    {
        var chapterDto = await chapter.GetChapter(novelId, order, cancellationToken);
        return chapterDto is null ? NotFound() : Ok(chapterDto); 
    }

    [HttpGet("{chapterId:guid}")]
    public async Task<IActionResult> GetChapter(Guid chapterId, CancellationToken cancellationToken = default)
    {
        var chapterDto = await chapter.GetChapter(chapterId, cancellationToken);
        return chapterDto is null ? NotFound() : Ok(chapterDto);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateChapter(CreateChapterRequest request,
        CancellationToken cancellationToken = default)
    {
        var chapterDto = await chapter.CreateChapter(request, cancellationToken);
        return chapterDto is null ? NotFound() : Ok(chapterDto);
    }

    [Authorize]
    [HttpPut]
    public async Task<IActionResult> UpdateChapter(UpdateChapterRequest request,
        CancellationToken cancellationToken = default)
    {
        var chapterDto = await chapter.UpdateChapter(request, cancellationToken);
        return chapterDto is null ? NotFound() : Ok(chapterDto);
    }

    [Authorize]
    [HttpDelete]
    public async Task<IActionResult> DeleteChapter(Guid chapterId, CancellationToken cancellationToken = default)
    {
        var result = await chapter.DeleteChapter(chapterId, cancellationToken);
        return result ? Ok() : NotFound();
    }
}
