using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Testcontainers.PostgreSql;
using VirtualNovel.IdentityService.Infrastructure.Database;

namespace VirtualNovel.IntegrationTests;

public sealed class UserServiceFactory
    : WebApplicationFactory<VirtualNovel.IdentityService.AssemblyMarker>,
        IAsyncLifetime
{
    private readonly PostgreSqlContainer _database =
        new PostgreSqlBuilder("postgres:17-alpine")
            .WithDatabase("virtual_novel_tests")
            .WithUsername("postgres")
            .WithPassword("postgres")
            .Build();

    public async Task InitializeAsync()
    {
        await _database.StartAsync();

        // Dopiero teraz tworzymy host, kiedy connection string kontenera już istnieje.
        _ = CreateClient();

        await using var scope = Services.CreateAsyncScope();

        var dbContext =
            scope.ServiceProvider.GetRequiredService<UserDbContext>();

        await dbContext.Database.MigrateAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureServices(services =>
        {
            services.AddHttpClient();
            services.AddSingleton(serviceProvider =>
                new FirebaseTokenGenerator(
                    serviceProvider
                        .GetRequiredService<IHttpClientFactory>()
                        .CreateClient(),
                    "127.0.0.1:9099"));
        });

        builder.UseSetting(
            "ConnectionStrings:Database",
            _database.GetConnectionString());

        builder.UseSetting(
            "Firebase:ProjectId",
            "demo-virtualnovel");

        builder.UseSetting(
            "Firebase:AuthenticationEmulatorHost",
            "127.0.0.1:9099");
    }

    public new async Task DisposeAsync()
    {
        await _database.DisposeAsync();
        await base.DisposeAsync();
    }
}
