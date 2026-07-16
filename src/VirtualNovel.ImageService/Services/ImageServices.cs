using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using VirtualNovel.BuildingBlocks.Authentication;
using VirtualNovel.ImageService.Dto.Request;
using VirtualNovel.ImageService.Interfaces;

namespace VirtualNovel.ImageService.Services;

public sealed class ImageServices : IImageServices
{
    private readonly Cloudinary _cloudinary;
    private readonly ICurrentUser _user;

    public ImageServices(IConfiguration configuration, ICurrentUser user)
    {
        _user = user;
        var configurationSection = configuration.GetRequiredSection("Cloudinary");
        var account = new Account(
            configurationSection["CloudName"],
            configurationSection["ApiKey"],
            configurationSection["ApiSecret"]);
        _cloudinary = new Cloudinary(account);
    }

    public async Task<UploadImageResponse> UploadImage(
        UploadFileRequest request,
        CancellationToken cancellationToken = default)
    {
        await using var stream = new MemoryStream(request.Data, writable: false);
        var imageType = request.ImageType.ToString().ToLowerInvariant();
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(request.Id, stream),
            Folder = imageType,
            PublicId = $"{request.Id}_{imageType}",
            UniqueFilename = false,
            Overwrite = true,
        };

        var uploadResult = await _cloudinary.UploadAsync(
            uploadParams,
            cancellationToken);

        if (uploadResult.Error is not null || uploadResult.SecureUrl is null)
        {
            throw new InvalidOperationException(
                uploadResult.Error?.Message ?? "Cloudinary did not return an image URL.");
        }

        return new UploadImageResponse(uploadResult.SecureUrl.AbsoluteUri);
    }
}
