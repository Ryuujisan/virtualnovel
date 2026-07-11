namespace VirtualNovel.BuildingBlocks.Authentication;

public interface ICurrentUser
{
    string FirebaseUid { get; }
    bool IsAuthenticated { get; }
}