using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using VirtualNovel.ImageService.Dto.Request;
using VirtualNovel.IntegrationTests.Infrastructure;

namespace VirtualNovel.IntegrationTests;

public sealed class ImageServiceTests(ImageServiceFactory factory)
    : IClassFixture<ImageServiceFactory>
{
    private static readonly byte[] PngBytes =
    [
        0x89, 0x50, 0x4E, 0x47,
        0x0D, 0x0A, 0x1A, 0x0A,
        0x00, 0x00, 0x00, 0x0D,
    ];

    [Fact]
    public async Task Upload_Image_Accepts_Byte_Array_And_Returns_Url()
    {
        using var client = CreateHttpsClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue(TestAuthenticationHandler.SchemeName, "token");
        var response = await client.PutAsJsonAsync("api/images", CreateUploadRequest());
        var result = await response.Content.ReadFromJsonAsync<UploadImageResponse>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(result);
        Assert.Equal(
            "https://images.example.test/cover/test-image-author_cover.png",
            result.Url);
        Assert.Equal("novel-123", factory.FakeImageServices.UploadedId);
        Assert.Equal(UploadImageType.Cover, factory.FakeImageServices.UploadedImageType);
        Assert.Equal(PngBytes, factory.FakeImageServices.UploadedBytes);
    }

    [Fact]
    public async Task Upload_Image_Requires_Authorization()
    {
        using var client = CreateHttpsClient();
        var response = await client.PutAsJsonAsync("api/images", CreateUploadRequest());

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    private static UploadFileRequest CreateUploadRequest() =>
        new("novel-123", PngBytes, UploadImageType.Cover);

    private HttpClient CreateHttpsClient()
    {
        return factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost"),
        });
    }
}
