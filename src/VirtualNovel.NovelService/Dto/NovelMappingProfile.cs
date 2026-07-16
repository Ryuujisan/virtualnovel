using AutoMapper;
using VirtualNovel.NovelService.Dto.Models;
using VirtualNovel.NovelService.Dto.Models.Novels;
using VirtualNovel.NovelService.Entities;

namespace VirtualNovel.NovelService.Dto;

public sealed class NovelMappingProfile : Profile
{
    public NovelMappingProfile()
    {
        CreateMap<Chapter, ChapterDto>()
            .ForCtorParam(nameof(ChapterDto.Title), options =>
                options.MapFrom(chapter => chapter.Name ?? string.Empty));

        CreateMap<Chapter, ChapterFeedDto>()
            .ForCtorParam(nameof(ChapterFeedDto.Title), options =>
                options.MapFrom(chapter => chapter.Name ?? string.Empty));

        CreateMap<Novel, NovelFeedDto>()
            .ForCtorParam(nameof(NovelFeedDto.Author), options =>
                options.MapFrom(novel => new AuthorPreviewDto(
                    novel.AuthorId,
                    novel.AuthorId,
                    null)))
            .ForCtorParam(nameof(NovelFeedDto.Title), options =>
                options.MapFrom(novel => novel.Name))
            .ForCtorParam(nameof(NovelFeedDto.Rating), options =>
                options.MapFrom(novel => AverageRating(novel.Ratings)))
            .ForCtorParam(nameof(NovelFeedDto.Romance), options =>
                options.MapFrom(novel => novel.RomanceType))
            .ForCtorParam(nameof(NovelFeedDto.Genres), options =>
                options.MapFrom(novel => novel.Genres));

        CreateMap<Novel, NovelDto>()
            .ForCtorParam(nameof(NovelDto.Author), options =>
                options.MapFrom(novel => new AuthorPreviewDto(
                    novel.AuthorId,
                    novel.AuthorId,
                    null)))
            .ForCtorParam(nameof(NovelDto.Title), options =>
                options.MapFrom(novel => novel.Name))
            .ForCtorParam(nameof(NovelDto.CoverUrl), options =>
                options.MapFrom(novel => novel.CoverUrl ?? string.Empty))
            .ForCtorParam(nameof(NovelDto.Rating), options =>
                options.MapFrom(novel => AverageRating(novel.Ratings)))
            .ForCtorParam(nameof(NovelDto.WorkType), options =>
                options.MapFrom(novel => novel.WorkType))
            .ForCtorParam(nameof(NovelDto.RomanceType), options =>
                options.MapFrom(novel => novel.RomanceType))
            .ForCtorParam(nameof(NovelDto.Chapters), options =>
                options.MapFrom(novel => novel.Chapters
                    .OrderBy(chapter => chapter.Order)
                    .ThenBy(chapter => chapter.Id)));
    }

    private static float AverageRating(ICollection<Rating> ratings)
    {
        return ratings.Count == 0
            ? 0
            : ratings.Average(rating => rating.Rate);
    }
}
