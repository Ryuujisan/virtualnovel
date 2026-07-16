namespace VirtualNovel.ImageService.Dto.Request;

public enum UploadImageType
{
    Avatar,
    Cover
}
public record UploadFileRequest
(
    string Id,
    byte[] Data,
    UploadImageType ImageType
);

public record UploadImageResponse(string Url);
