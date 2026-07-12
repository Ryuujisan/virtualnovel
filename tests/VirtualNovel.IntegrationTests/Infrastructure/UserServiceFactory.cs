using VirtualNovel.IdentityService.Infrastructure.Database;

namespace VirtualNovel.IntegrationTests.Infrastructure;

public sealed class UserServiceFactory
    : ServiceFactory<
        VirtualNovel.IdentityService.AssemblyMarker,
        UserDbContext>;
