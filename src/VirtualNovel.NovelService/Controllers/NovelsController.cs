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
        [FromQuery(Name = "type")] ERomanceType romanceType = ERomanceType.None,
        [FromQuery(Name = "author")] string? author = "",
        [FromQuery] EStatus? status = null,
        [FromQuery] int? minChapters = null,
        [FromQuery] int? maxChapters = null,
        [FromQuery(Name = "sort")] string sortBy = "updatedAt",
        [FromQuery] string direction = "desc",
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        if (page < 1)
        {
            return BadRequest("Page musi być większe lub równe 1.");
        }

        if (pageSize is < 1 or > 100)
        {
            return BadRequest("PageSize musi mieścić się w zakresie 1-100.");
        }

        if (minChapters is < 0 || maxChapters is < 0 ||
            minChapters > maxChapters)
        {
            return BadRequest("Zakres liczby rozdziałów jest nieprawidłowy.");
        }

        var descending = direction.ToLowerInvariant() switch
        {
            "desc" => true,
            "asc" => false,
            _ => (bool?)null
        };

        if (descending is null)
        {
            return BadRequest("Direction musi mieć wartość 'asc' albo 'desc'.");
        }

        string[] supportedSorts =
            ["updatedAt", "createdAt", "rating", "chapterCount", "chapters", "title"];
        if (!supportedSorts.Contains(sortBy, StringComparer.OrdinalIgnoreCase))
        {
            return BadRequest(
                $"Nieobsługiwane sortowanie: '{sortBy}'.");
        }

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

        var result = await novel.GetNovelFeed(
            genres,
            romanceType,
            author,
            status,
            minChapters,
            maxChapters,
            sortBy,
            descending.Value,
            page,
            pageSize,
            cancellationToken);

        return Ok(result);
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
