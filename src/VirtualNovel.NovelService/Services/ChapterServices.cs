using AutoMapper;
using Microsoft.EntityFrameworkCore;
using VirtualNovel.BuildingBlocks.Authentication;
using VirtualNovel.NovelService.Dto.Models;
using VirtualNovel.NovelService.Dto.Requests;
using VirtualNovel.NovelService.Entities;
using VirtualNovel.NovelService.Infrastructure.Database;

namespace VirtualNovel.NovelService.Services;

public class ChapterServices
    (NovelDbContext db, IMapper mapper, ICurrentUser currentUser): IChapterServices
{
    public async Task<ChapterDto?> GetChapter(Guid chapterId, CancellationToken cancellationToken = default)
    {
        var chapter = await db.Chapters.AsNoTracking().FirstOrDefaultAsync(x => x.Id == chapterId, cancellationToken);
        return mapper.Map<ChapterDto>(chapter);
    }

    public async Task<ChapterDto?> GetChapter(Guid novelId, int order, CancellationToken cancellationToken = default)
    {
        if (order < 1)
        {
            return null;
        }
        
        var chapter = await db.Chapters.AsNoTracking().FirstOrDefaultAsync(f => f.NovelId == novelId && f.Order == order, cancellationToken);
        return mapper.Map<ChapterDto>(chapter);
    }

    public async Task<ChapterDto?> CreateChapter(CreateChapterRequest request, CancellationToken cancellationToken = default)
    {
        var novel = await db.Novels
            .FirstOrDefaultAsync(
                x => x.Id == request.NovelId &&
                     x.AuthorId == currentUser.FirebaseUid,
                cancellationToken);
        if (novel is null)
        {
            return null;
        }
        var lastOrder = await db.Chapters
            .Where(chapter => chapter.NovelId == request.NovelId)
            .Select(chapter => (int?)chapter.Order)
            .MaxAsync(cancellationToken) ?? 0;
        var now = DateTime.UtcNow;
        var chapter = new Chapter()
        {
            NovelId = request.NovelId,
            Content = request.Content,
            Description = request.ChapterDescription,
            Order = lastOrder + 1,
            Name = request.ChapterName,
            UpdatedAt = now,
            CreatedAt = now,
        };
        db.Chapters.Add(chapter);
        await db.SaveChangesAsync(cancellationToken);
        return mapper.Map<ChapterDto>(chapter);
    }

    public async Task<ChapterDto?> UpdateChapter(UpdateChapterRequest request, CancellationToken cancellationToken = default)
    {
        var novel = await db.Novels
            .Include(novel => novel.Chapters)
            .FirstOrDefaultAsync(
                novel => novel.Chapters.Any(chapter => chapter.Id == request.Id),
                cancellationToken);

        if (novel is null || novel.AuthorId != currentUser.FirebaseUid)
        {
            return null;
        }

        var chapter = novel.Chapters.Single(chapter => chapter.Id == request.Id);
        if (request.Order != -1 &&
            (request.Order < 1 || request.Order > novel.Chapters.Count))
        {
            return null;
        }
        
        bool anyChanges = false;
        if(request.ChapterDescription  != chapter.Description)
        {
            chapter.Description = request.ChapterDescription;
            anyChanges = true;
        }

        if (request.ChapterName != chapter.Name)
        {
            chapter.Name = request.ChapterName;
            anyChanges = true;
        }

        if (request.Content != chapter.Content)
        {
            chapter.Content = request.Content;
            anyChanges = true;
        }

        if (request.Order != -1 && chapter.Order != request.Order)
        {
            var oldOrder = chapter.Order;
            var newOrder = request.Order;

            if (newOrder < oldOrder)
            {
                foreach (var item in novel.Chapters
                             .Where(c => c.Order >= newOrder && c.Order < oldOrder))
                {
                    item.Order++;
                }
            }
            else if (newOrder > oldOrder)
            {
                foreach (var item in novel.Chapters
                             .Where(c => c.Order > oldOrder && c.Order <= newOrder))
                {
                    item.Order--;
                }
            }

            chapter.Order = newOrder;
            anyChanges = true;
        }

        if (anyChanges)
        {
            chapter.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(cancellationToken);
        }
        return mapper.Map<ChapterDto>(chapter);
    }

    public async Task<bool> DeleteChapter(Guid chapterId, CancellationToken cancellationToken = default)
    {
        var novel = await db.Novels
            .Include(novel => novel.Chapters)
            .FirstOrDefaultAsync(
                novel => novel.Chapters.Any(chapter => chapter.Id == chapterId),
                cancellationToken);

        if (novel is null || novel.AuthorId != currentUser.FirebaseUid)
        {
            return false;
        }

        var chapter = novel.Chapters.Single(chapter => chapter.Id == chapterId);
        foreach (var followingChapter in novel.Chapters.Where(
                     item => item.Order > chapter.Order))
        {
            followingChapter.Order--;
            followingChapter.UpdatedAt = DateTime.UtcNow;
        }

        db.Chapters.Remove(chapter);
        await db.SaveChangesAsync(cancellationToken);

        return true;
    }
}
