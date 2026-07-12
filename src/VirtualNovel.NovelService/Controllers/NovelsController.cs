using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VirtualNovel.NovelService.Dto.Models.Novels;
using VirtualNovel.NovelService.Dto.Requests;
using VirtualNovel.NovelService.Entities;
using VirtualNovel.NovelService.Services;

namespace VirtualNovel.NovelService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NovelsController
    (INovelService novel) : ControllerBase
{

    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<NovelFeedDto>>> GetNovelFeed(
        [FromQuery(Name = "genre")] string? genreQuery,
        [FromQuery] ERomanceType type = ERomanceType.None,
        CancellationToken cancellationToken = default)
    {
        var genres = new List<EGenre>();

        if (!string.IsNullOrWhiteSpace(genreQuery))
        {
            foreach (var value in genreQuery.Split(
                         ',',
                         StringSplitOptions.RemoveEmptyEntries |
                         StringSplitOptions.TrimEntries))
            {
                if (!Enum.TryParse<EGenre>(
                        value,
                        ignoreCase: true,
                        out var genre))
                {
                    return BadRequest(
                        $"Nieznany gatunek: '{value}'.");
                }

                genres.Add(genre);
            }
        }

        var result = await GetFilteredNovelFeed(genres, type, cancellationToken);

        return Ok(result);
    }

    private async Task<IReadOnlyCollection<NovelFeedDto>> GetFilteredNovelFeed(List<EGenre> genres, ERomanceType type, CancellationToken cancellationToken = default)
    {
        if (genres.Count == 0 && type == ERomanceType.None)
        {
            return await novel.GetNovelFeed(cancellationToken);
        }
  
        return await novel.GetFilteredNovelFeed(genres, type, cancellationToken);
    }
    
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<NovelDto>> GetNovel(Guid id, CancellationToken cancellationToken = default)
    {
        var result = await novel.GetNovel(id, cancellationToken);
        return result is null ? NotFound() : Ok(result);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<NovelDto>> CreateNovel(CreateNovelRequest request,
        CancellationToken cancellationToken = default)
    {
        Console.WriteLine(request);
        var novelDto = await novel.CreateNovel(request, cancellationToken);
        return novelDto is null ? NotFound() : Ok(novelDto);
    }

    [Authorize]
    [HttpPut]
    public async Task<ActionResult<NovelDto>> UpdateNovel(UpdateNovelRequest request, CancellationToken cancellationToken = default)
    {
        var novelDto = await novel.UpdateNovel(request, cancellationToken);
        return novelDto is null ? NotFound() : Ok(novelDto);
    }

    [Authorize]
    [HttpDelete]
    public async Task<ActionResult<NovelDto>> DeleteNovel([FromBody] Guid id,
        CancellationToken cancellationToken = default)
    {
        var result = await novel.DeleteNovel(id, cancellationToken);
        return result ? NoContent() : NotFound();
    }
}
