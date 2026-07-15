using AutoMapper;
using Microsoft.EntityFrameworkCore;
using VirtualNovel.BuildingBlocks.Authentication;
using VirtualNovel.NovelService.Dto.Models.Novels;
using VirtualNovel.NovelService.Dto.Requests;
using VirtualNovel.NovelService.Entities;
using VirtualNovel.NovelService.Infrastructure.Database;

namespace VirtualNovel.NovelService.Services;

public class NovelServices 
    (NovelDbContext db,
        IMapper mapper,
        ICurrentUser currentUser,
        IUserServiceClient userServiceClient,
        ILogger<NovelServices> logger): INovelService
{
    public async Task<IReadOnlyCollection<NovelFeedDto>> GetNovelFeed(
        ICollection<EGenre> genres,
        ERomanceType romanceType,
        string? author,
        EStatus? status,
        int? minChapters = null,
        int? maxChapters = null,
        string sortBy = "updatedAt",
        bool descending = true,
        int page = 1,
        int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        IQueryable<Novel> query = db.Novels
            .AsNoTracking();
        if (!string.IsNullOrWhiteSpace(author))
        {
            query = query.Where(novel => novel.AuthorId == author);
        }

        if (genres.Count > 0)
        {
            query = query.Where(n =>
                n.Genres.Any(genre => genres.Contains(genre)));
        }

        if (romanceType != ERomanceType.None)
        {
            query = query.Where(n =>
                n.RomanceType == romanceType);
        }

        if (status is not null)
        {
            query = query.Where(novel => novel.Status == status);
        }

        if (minChapters is not null)
        {
            query = query.Where(novel => novel.Chapters.Count >= minChapters);
        }

        if (maxChapters is not null)
        {
            query = query.Where(novel => novel.Chapters.Count <= maxChapters);
        }

        var orderedQuery = sortBy.ToLowerInvariant() switch
        {
            "createdat" => descending
                ? query.OrderByDescending(novel => novel.CreatedAt)
                : query.OrderBy(novel => novel.CreatedAt),
            "rating" => descending
                ? query.OrderByDescending(novel => novel.Ratings
                    .Select(rating => (float?)rating.Rate)
                    .Average() ?? 0)
                : query.OrderBy(novel => novel.Ratings
                    .Select(rating => (float?)rating.Rate)
                    .Average() ?? 0),
            "chaptercount" or "chapters" => descending
                ? query.OrderByDescending(novel => novel.Chapters.Count)
                : query.OrderBy(novel => novel.Chapters.Count),
            "title" => descending
                ? query.OrderByDescending(novel => novel.Name)
                : query.OrderBy(novel => novel.Name),
            _ => descending
                ? query.OrderByDescending(novel => novel.UpdatedAt)
                : query.OrderBy(novel => novel.UpdatedAt)
        };

        var novels = await orderedQuery
            .ThenBy(novel => novel.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Include(novel => novel.Ratings)
            .ToListAsync(cancellationToken);

        return mapper.Map<IReadOnlyCollection<NovelFeedDto>>(novels);
    }

    public async Task<IReadOnlyCollection<NovelFeedDto>> GetNovelsByAuthor(string authorId, CancellationToken cancellationToken = default)
    {
        var novelFeed = await db.Novels.AsNoTracking()
            .Include(i => i.Ratings)
            .Where(n => n.AuthorId == authorId).ToListAsync(cancellationToken);
        return mapper.Map<IReadOnlyCollection<NovelFeedDto>>(novelFeed);
    }

    public async Task<NovelDto?> GetNovel(Guid novelId, CancellationToken cancellationToken = default)
    {
        var novel = await db.Novels.AsNoTracking()
            .Include(i => i.Ratings)
            .Include(i => i.Chapters)
            .FirstOrDefaultAsync(n => n.Id == novelId, cancellationToken);
        return novel is null
            ? null
            : await MapNovelAsync(novel, cancellationToken);
    }

    public async Task<NovelDto?> CreateNovel(CreateNovelRequest request, CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var novel = new Novel()
        {
            AuthorId = currentUser.FirebaseUid,
            Description = request.Description,
            Name = request.Name,
            CoverUrl = request.CoverUrl,
            RomanceType = request.RomanceType,
            WorkType = request.WorkType,
            Genres = request.Genres,
            Status = EStatus.Publishing,
            CreatedAt = now,
            UpdatedAt = now,
        };
        db.Novels.Add(novel);
        await db.SaveChangesAsync(cancellationToken);
        return await MapNovelAsync(novel, cancellationToken);
    }

    public async Task<NovelDto?> UpdateNovel(
        UpdateNovelRequest request,
        CancellationToken cancellationToken = default)
    {
        
        var novel = await db.Novels.FirstOrDefaultAsync(
                n => n.Id == request.NovelId,
                cancellationToken);

        if (novel is null ||
            novel.AuthorId != currentUser.FirebaseUid)
        {
            return null;
        }

        var anyChanges = false;

        if (request.CoverUrl != novel.CoverUrl)
        {
            novel.CoverUrl = request.CoverUrl;
            anyChanges = true;
        }

        if (request.RomanceType != novel.RomanceType)
        {
            novel.RomanceType = request.RomanceType;
            anyChanges = true;
        }

        if (request.WorkType != novel.WorkType)
        {
            novel.WorkType = request.WorkType;
            anyChanges = true;
        }

        if (!novel.Genres.ToHashSet().SetEquals(request.Genres))
        {
            novel.Genres = request.Genres.ToList();
            anyChanges = true;
        }

        if (request.Name != novel.Name)
        {
            novel.Name = request.Name;
            anyChanges = true;
        }

        if (request.Description != novel.Description)
        {
            novel.Description = request.Description;
            anyChanges = true;
        }

        if (anyChanges)
        {
            novel.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(cancellationToken);
        }

        return await MapNovelAsync(novel, cancellationToken);
    }

    public async Task<bool> DeleteNovel(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var novel = await db.Novels.FirstOrDefaultAsync(
            n => n.Id == id,
            cancellationToken);

        if (novel is null ||
            novel.AuthorId != currentUser.FirebaseUid)
        {
            return false;
        }

        db.Novels.Remove(novel);
        await db.SaveChangesAsync(cancellationToken);

        return true;
    }

    private async Task<NovelDto> MapNovelAsync(
        Novel novel,
        CancellationToken cancellationToken)
    {
        var result = mapper.Map<NovelDto>(novel);

        try
        {
            var author = await userServiceClient.GetAuthorPreviewAsync(
                novel.AuthorId,
                cancellationToken);

            return author is null
                ? result
                : result with { Author = author };
        }
        catch (HttpRequestException exception)
        {
            logger.LogWarning(
                exception,
                "Could not load author {AuthorId} from UserService.",
                novel.AuthorId);
            return result;
        }
        catch (TaskCanceledException exception)
            when (!cancellationToken.IsCancellationRequested)
        {
            logger.LogWarning(
                exception,
                "Loading author {AuthorId} from UserService timed out.",
                novel.AuthorId);
            return result;
        }
    }
}
