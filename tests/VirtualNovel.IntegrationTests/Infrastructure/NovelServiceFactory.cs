using VirtualNovel.NovelService.Infrastructure.Database;

namespace VirtualNovel.IntegrationTests.Infrastructure;

public sealed class NovelServiceFactory
    : ServiceFactory<
        VirtualNovel.NovelService.AssemblyMarker,
        NovelDbContext>;
