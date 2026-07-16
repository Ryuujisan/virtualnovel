using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using VirtualNovel.ImageService.Dto.Request;
using VirtualNovel.ImageService.Interfaces;

namespace VirtualNovel.IntegrationTests.Infrastructure;

public sealed class ImageServiceFactory
    : WebApplicationFactory<VirtualNovel.ImageService.AssemblyMarker>
{
    public FakeImageServices FakeImageServices { get; } = new();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.UseSetting("Firebase:ProjectId", "demo-virtualnovel");

        builder.ConfigureTestServices(services =>
        {
            services.RemoveAll<IImageServices>();
            services.AddSingleton<IImageServices>(FakeImageServices);

            services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = TestAuthenticationHandler.SchemeName;
                    options.DefaultChallengeScheme = TestAuthenticationHandler.SchemeName;
                })
                .AddScheme<AuthenticationSchemeOptions, TestAuthenticationHandler>(
                    TestAuthenticationHandler.SchemeName,
                    _ => { });
        });
    }
}

public sealed class FakeImageServices : IImageServices
{
    public byte[]? UploadedBytes { get; private set; }
    public string? UploadedId { get; private set; }
    public UploadImageType? UploadedImageType { get; private set; }

    public async Task<UploadImageResponse> UploadImage(
        UploadFileRequest request,
        CancellationToken cancellationToken = default)
    {
        await using var stream = new MemoryStream(request.Data, writable: false);
        await using var memory = new MemoryStream();
        await stream.CopyToAsync(memory, cancellationToken);

        UploadedBytes = memory.ToArray();
        UploadedId = request.Id;
        UploadedImageType = request.ImageType;

        return new UploadImageResponse(
            "https://images.example.test/cover/test-image-author_cover.png");
    }
}
