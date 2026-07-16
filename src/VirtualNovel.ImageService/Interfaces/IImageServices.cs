using VirtualNovel.ImageService.Dto.Request;

namespace VirtualNovel.ImageService.Interfaces;

public interface IImageServices
{
    Task<UploadImageResponse> UploadImage(
        UploadFileRequest request,
        CancellationToken cancellationToken = default);
}
