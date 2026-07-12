using Microsoft.EntityFrameworkCore;
using VirtualNovel.IdentityService.Entities;

namespace VirtualNovel.IdentityService.Infrastructure.Database;

public static class UserDbSeeder
{
    public static async Task SeedAsync(
        IServiceProvider services,
        CancellationToken cancellationToken = default)
    {
        await using var scope = services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<UserDbContext>();

        var createdAt = new DateTime(2026, 1, 15, 12, 0, 0, DateTimeKind.Utc);
        var users = new[]
        {
            Create("seed-user-01", "Mira North", "Piszę fantasy o miastach, które pamiętają swoich mieszkańców.", "https://i.pravatar.cc/300?img=47", createdAt),
            Create("seed-user-02", "Kaito Vale", "Miłośnik science fiction, starych map i bardzo mocnej kawy.", "https://i.pravatar.cc/300?img=12", createdAt.AddDays(2)),
            Create("seed-user-03", "Lena Wolska", "Redaktorka amatorka. Zostawiam szczere, ale życzliwe komentarze.", "https://i.pravatar.cc/300?img=32", createdAt.AddDays(4)),
            Create("seed-user-04", "Noah Ash", "Horror, tajemnice i bohaterowie podejmujący fatalne decyzje.", "https://i.pravatar.cc/300?img=11", createdAt.AddDays(6)),
            Create("seed-user-05", "Aya Mori", "Piszę spokojne historie obyczajowe z odrobiną magii.", "https://i.pravatar.cc/300?img=25", createdAt.AddDays(8)),
            Create("seed-user-06", "Tomas Reed", "Czytam wszystko, jeśli pierwszy rozdział ma dobry haczyk.", "https://i.pravatar.cc/300?img=15", createdAt.AddDays(10)),
            Create("seed-user-07", "Nadia Sol", "Fanka przygód, pojedynków i nietypowych drużyn bohaterów.", "https://i.pravatar.cc/300?img=44", createdAt.AddDays(12)),
            Create("seed-user-08", "Jun Park", "Buduję światy, a potem sprawdzam, jak szybko bohaterowie je zepsują.", "https://i.pravatar.cc/300?img=5", createdAt.AddDays(14)),
            Create("seed-user-09", "Iris Bell", "Romans powinien komplikować fabułę, nie ją zastępować.", "https://i.pravatar.cc/300?img=49", createdAt.AddDays(16)),
            Create("seed-user-10", "Leon Hart", "Nowy czytelnik. Kolekcjonuję historie z dobrym zakończeniem.", "https://i.pravatar.cc/300?img=14", createdAt.AddDays(18))
        };

        var seedIds = users.Select(user => user.FirebaseUid).ToArray();
        var existingIds = await dbContext.Users
            .Where(user => seedIds.Contains(user.FirebaseUid))
            .Select(user => user.FirebaseUid)
            .ToListAsync(cancellationToken);

        dbContext.Users.AddRange(users.Where(user => !existingIds.Contains(user.FirebaseUid)));
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static UserProfile Create(
        string firebaseUid,
        string displayName,
        string bio,
        string avatarUrl,
        DateTime createdAt) => new()
    {
        FirebaseUid = firebaseUid,
        DisplayName = displayName,
        Bio = bio,
        AvatarUrl = avatarUrl,
        CreatedAt = createdAt,
        UpdatedAt = createdAt
    };
}
