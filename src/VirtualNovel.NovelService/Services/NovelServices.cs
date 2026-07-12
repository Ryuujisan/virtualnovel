using AutoMapper;
using Microsoft.EntityFrameworkCore;
using VirtualNovel.BuildingBlocks.Authentication;
using VirtualNovel.NovelService.Dto.Models.Novels;
using VirtualNovel.NovelService.Dto.Requests;
using VirtualNovel.NovelService.Entities;
using VirtualNovel.NovelService.Infrastructure.Database;

namespace VirtualNovel.NovelService.Services;

public class NovelServices 
    (NovelDbContext db, IMapper mapper, ICurrentUser currentUser): INovelService
{
    public async Task<IReadOnlyCollection<NovelFeedDto>> GetNovelFeed(CancellationToken cancellationToken = default)
    {
        var novelFeed = await db.Novels
            .AsNoTracking()
            .Include(i => i.Ratings)
            .ToListAsync(cancellationToken);
        return mapper.Map<IReadOnlyCollection<NovelFeedDto>>(novelFeed);
    }

    public async Task<IReadOnlyCollection<NovelFeedDto>> GetFilteredNovelFeed(
        ICollection<EGenre> genres,
        ERomanceType romanceType = ERomanceType.None,
        CancellationToken cancellationToken = default)
    {
        IQueryable<Novel> query = db.Novels
            .AsNoTracking()
            .Include(n => n.Ratings);

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

        var novels = await query.ToListAsync(cancellationToken);

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
        return mapper.Map<NovelDto>(novel);
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
        return mapper.Map<NovelDto>(novel);
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

        return mapper.Map<NovelDto>(novel);
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
}
