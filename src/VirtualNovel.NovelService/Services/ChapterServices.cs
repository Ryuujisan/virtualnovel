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
        novel.UpdatedAt = now;
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
            ShiftChapter(novel.Chapters, chapter, request.Order);
            anyChanges = true;
        }

        if (anyChanges)
        {
            chapter.UpdatedAt = DateTime.UtcNow;
            novel.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(cancellationToken);
        }
        return mapper.Map<ChapterDto>(chapter);
    }

    public async Task<ChapterDto?> ReorderChapter(ReorderChapterRequest request,
        CancellationToken cancellationToken = default)
    {
        var novel = await db.Novels
            .Include(item => item.Chapters)
            .FirstOrDefaultAsync(
                item => item.Chapters.Any(chapter => chapter.Id == request.ChapterId),
                cancellationToken);

        if (novel is null ||
            novel.AuthorId != currentUser.FirebaseUid ||
            request.NewOrder < 1 ||
            request.NewOrder > novel.Chapters.Count)
        {
            return null;
        }

        var chapter = novel.Chapters.Single(item => item.Id == request.ChapterId);
        if (chapter.Order == request.NewOrder)
        {
            return mapper.Map<ChapterDto>(chapter);
        }

        var now = DateTime.UtcNow;
        ShiftChapter(novel.Chapters, chapter, request.NewOrder);
        chapter.UpdatedAt = now;
        novel.UpdatedAt = now;
        await db.SaveChangesAsync(cancellationToken);

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
        var now = DateTime.UtcNow;
        foreach (var followingChapter in novel.Chapters.Where(
                     item => item.Order > chapter.Order))
        {
            followingChapter.Order--;
            followingChapter.UpdatedAt = now;
        }

        novel.UpdatedAt = now;
        db.Chapters.Remove(chapter);
        await db.SaveChangesAsync(cancellationToken);

        return true;
    }

    private static void ShiftChapter(ICollection<Chapter> chapters, Chapter chapter, int newOrder)
    {
        var oldOrder = chapter.Order;
        if (newOrder < oldOrder)
        {
            foreach (var item in chapters.Where(item =>
                         item.Order >= newOrder && item.Order < oldOrder))
            {
                item.Order++;
            }
        }
        else
        {
            foreach (var item in chapters.Where(item =>
                         item.Order > oldOrder && item.Order <= newOrder))
            {
                item.Order--;
            }
        }

        chapter.Order = newOrder;
    }
}
