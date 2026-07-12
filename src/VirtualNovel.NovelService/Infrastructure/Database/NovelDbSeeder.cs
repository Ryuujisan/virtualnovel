using Microsoft.EntityFrameworkCore;
using VirtualNovel.NovelService.Entities;

namespace VirtualNovel.NovelService.Infrastructure.Database;

public static class NovelDbSeeder
{
    private static readonly DateTime SeedDate =
        new(2026, 3, 1, 18, 0, 0, DateTimeKind.Utc);

    public static async Task SeedAsync(
        IServiceProvider services,
        CancellationToken cancellationToken = default)
    {
        await using var scope = services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<NovelDbContext>();
        var specifications = GetSpecifications();
        var seedIds = specifications.Select(specification => specification.Id).ToArray();
        var existingIds = await dbContext.Novels
            .Where(novel => seedIds.Contains(novel.Id))
            .Select(novel => novel.Id)
            .ToListAsync(cancellationToken);

        var novels = specifications
            .Select((specification, index) => (Specification: specification, Index: index))
            .Where(item => !existingIds.Contains(item.Specification.Id))
            .Select(item => CreateNovel(item.Specification, item.Index))
            .ToList();

        if (novels.Count == 0)
        {
            return;
        }

        dbContext.Novels.AddRange(novels);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static Novel CreateNovel(NovelSeed specification, int seedOffset)
    {
        var random = new Random(7421 + seedOffset * 97);
        var chapterCount = random.Next(3, 21);
        var novel = new Novel
        {
            Id = specification.Id,
            AuthorId = specification.AuthorId,
            Name = specification.Title,
            Description = specification.Description,
            CoverUrl = specification.CoverUrl,
            Status = specification.Status,
            RomanceType = specification.RomanceType,
            WorkType = specification.WorkType,
            Genres = specification.Genres,
            CreatedAt = SeedDate.AddDays(seedOffset * 3),
            UpdatedAt = SeedDate.AddDays(seedOffset * 3 + chapterCount * 2)
        };

        novel.Chapters = Enumerable.Range(1, chapterCount)
            .Select(order => CreateChapter(novel, order, random))
            .ToList();

        var ratingCount = random.Next(3, 10);
        novel.Ratings = Enumerable.Range(0, ratingCount)
            .Select(index => new Rating
            {
                UserId = $"seed-user-{(index + seedOffset) % 10 + 1:00}",
                Novel = novel,
                Rate = random.Next(1, 6)
            })
            .ToList();

        return novel;
    }

    private static Chapter CreateChapter(Novel novel, int order, Random random)
    {
        string[] openings =
        [
            "Nieoczekiwany list", "Ślad na mapie", "Gość po zmroku",
            "Cena obietnicy", "Droga przez mgłę", "Głos zza drzwi",
            "Dzień bez cienia", "Ostatni pociąg", "Pęknięte lustro",
            "Sekret starego mostu", "Powrót posłańca", "Burza nad miastem"
        ];
        string[] developments =
        [
            "Bohaterowie odkrywają wskazówkę, która zmienia znaczenie ich dotychczasowej podróży.",
            "Spokojny plan rozpada się, gdy na drodze pojawia się ktoś znający prawdziwy cel wyprawy.",
            "Dawny konflikt wraca w najmniej odpowiednim momencie i zmusza drużynę do trudnego wyboru.",
            "Rozmowa, która miała przynieść odpowiedzi, ujawnia kolejną warstwę tajemnicy.",
            "Pozornie niewielka decyzja uruchamia wydarzenia, których nie da się już zatrzymać.",
            "Nowy sojusznik oferuje pomoc, ale jego wersja wydarzeń nie zgadza się z faktami."
        ];

        var title = openings[(order - 1) % openings.Length];
        var description = developments[random.Next(developments.Length)];
        var publishedAt = novel.CreatedAt.AddDays(order * 2);

        return new Chapter
        {
            Novel = novel,
            Order = order,
            Name = $"{order}. {title}",
            Description = description,
            Content = $"{description}\n\nPoranek przyniósł więcej pytań niż odpowiedzi. Każdy szczegół miejsca zdawał się potwierdzać, że ktoś przygotował tę chwilę z dużym wyprzedzeniem. Zamiast zawrócić, bohaterowie postanowili sprawdzić jedyny trop, który nadal miał sens.\n\nWieczorem stało się jasne, że konsekwencje tej decyzji dosięgną nie tylko ich. Na horyzoncie pojawił się znak zapowiadający następny etap podróży.",
            CreatedAt = publishedAt,
            UpdatedAt = publishedAt
        };
    }

    private static IReadOnlyList<NovelSeed> GetSpecifications() =>
    [
        new("10000000-0000-0000-0000-000000000001", "seed-user-01", "Archiwum Deszczowego Miasta", "W mieście, w którym deszcz odsłania cudze wspomnienia, młoda kartografka znajduje mapę prowadzącą do dnia wymazanego z historii.", "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80", EStatus.Publishing, ERomanceType.Yuri, EWorkType.Original, [EGenre.Fantasy, EGenre.Mystery, EGenre.Drama]),
        new("10000000-0000-0000-0000-000000000002", "seed-user-02", "Ostatnia Stacja Helios", "Załoga opuszczonej stacji budzi sztuczną inteligencję, która twierdzi, że Słońce zgasło osiem minut temu.", "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80", EStatus.Complete, ERomanceType.None, EWorkType.Original, [EGenre.SciFi, EGenre.Psychological, EGenre.Mystery]),
        new("10000000-0000-0000-0000-000000000003", "seed-user-05", "Herbaciarnia na Końcu Lata", "Niewielka herbaciarnia spełnia jedno niewypowiedziane życzenie każdego gościa, ale właścicielka nigdy nie może poznać jego ceny.", "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80", EStatus.Publishing, ERomanceType.Hetero, EWorkType.Original, [EGenre.SliceOfLife, EGenre.Romance, EGenre.Supernatural]),
        new("10000000-0000-0000-0000-000000000004", "seed-user-04", "Dom, Który Oddycha Nocą", "Czworo studentów wynajmuje tani dom. Każdej nocy pojawia się w nim nowy pokój, a jedno z ich wspomnień znika.", "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=900&q=80", EStatus.Hiatus, ERomanceType.Mixed, EWorkType.Original, [EGenre.Horror, EGenre.Psychological, EGenre.Supernatural]),
        new("10000000-0000-0000-0000-000000000005", "seed-user-07", "Żelazny Żuraw", "Młoda kurierka przemierza krainę walczących szkół z listem zawierającym technikę zdolną zakończyć wojnę.", "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=900&q=80", EStatus.Publishing, ERomanceType.None, EWorkType.Original, [EGenre.Action, EGenre.Adventure, EGenre.MartialArts]),
        new("10000000-0000-0000-0000-000000000006", "seed-user-03", "Biblioteka Utraconych Imion", "Bibliotekarka odkrywa księgę zapisującą imiona ludzi, którzy wkrótce znikną ze wszystkich wspomnień.", "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80", EStatus.Complete, ERomanceType.Hetero, EWorkType.Original, [EGenre.Fantasy, EGenre.Mystery, EGenre.Romance]),
        new("10000000-0000-0000-0000-000000000007", "seed-user-08", "Między Orbitami", "Dwoje rywalizujących pilotów zostaje uwięzionych na uszkodzonym frachtowcu dryfującym między koloniami Marsa.", "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80", EStatus.Publishing, ERomanceType.Yaoi, EWorkType.Original, [EGenre.SciFi, EGenre.Adventure, EGenre.Romance]),
        new("10000000-0000-0000-0000-000000000008", "seed-user-09", "Siedem Listów do Zimy", "Po powrocie do rodzinnego miasteczka fotografka otrzymuje listy od przyjaciółki, która zaginęła siedem lat wcześniej.", "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=900&q=80", EStatus.Complete, ERomanceType.Yuri, EWorkType.Original, [EGenre.Drama, EGenre.Romance, EGenre.Mystery]),
        new("10000000-0000-0000-0000-000000000009", "seed-user-06", "Królestwo z Papieru", "Uczeń introligatora trafia do świata zbudowanego z niedokończonych opowieści i musi odnaleźć ich zaginionego autora.", "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80", EStatus.Abandoned, ERomanceType.None, EWorkType.Original, [EGenre.Isekai, EGenre.Fantasy, EGenre.Adventure]),
        new("10000000-0000-0000-0000-000000000010", "seed-user-10", "Cisza pod Lodem", "Ekspedycja polarna odbiera sygnał radiowy nadawany spod lodowca w języku, którego nikt jeszcze nie stworzył.", "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=900&q=80", EStatus.Hiatus, ERomanceType.None, EWorkType.Original, [EGenre.Horror, EGenre.SciFi, EGenre.Psychological]),
        new("10000000-0000-0000-0000-000000000011", "seed-user-01", "Kwiaty dla Mechanicznej Bogini", "Mechaniczka z portowego miasta naprawia starożytnego automata, który uważa ją za ostatnią kapłankę zapomnianej bogini.", "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80", EStatus.Publishing, ERomanceType.Yuri, EWorkType.Original, [EGenre.Fantasy, EGenre.SciFi, EGenre.Romance]),
        new("10000000-0000-0000-0000-000000000012", "seed-user-02", "Akademia Drugiej Szansy", "Uczniowie magicznej akademii budzą się w pierwszym dniu semestru, pamiętając katastrofę, która wydarzy się za sto dni.", "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=900&q=80", EStatus.Publishing, ERomanceType.Mixed, EWorkType.Original, [EGenre.School, EGenre.Fantasy, EGenre.Comedy]),
        new("10000000-0000-0000-0000-000000000013", "seed-user-04", "Nocny Pociąg do Aster", "Konduktor pociągu kursującego między snami próbuje odnaleźć pasażerkę, która nigdy się nie obudziła.", "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=900&q=80", EStatus.Complete, ERomanceType.Hetero, EWorkType.Original, [EGenre.Supernatural, EGenre.Drama, EGenre.Mystery]),
        new("10000000-0000-0000-0000-000000000014", "seed-user-07", "Smoczy Dług", "Łowczyni smoków musi chronić ostatnie smocze pisklę, aby spłacić dług wobec wioski, którą kiedyś zawiodła.", "https://images.unsplash.com/photo-1577493340887-b7bfff550145?auto=format&fit=crop&w=900&q=80", EStatus.Publishing, ERomanceType.Yaoi, EWorkType.Original, [EGenre.Action, EGenre.Fantasy, EGenre.Adventure]),
        new("10000000-0000-0000-0000-000000000015", "seed-user-09", "Echo po Północy", "Prowadząca nocną audycję radiową odbiera telefony od słuchaczy opisujących zdarzenia, które nastąpią następnego dnia.", "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=80", EStatus.Abandoned, ERomanceType.Mixed, EWorkType.Fanfiction, [EGenre.Mystery, EGenre.Supernatural, EGenre.Drama])
    ];

    private sealed record NovelSeed(
        string IdValue,
        string AuthorId,
        string Title,
        string Description,
        string CoverUrl,
        EStatus Status,
        ERomanceType RomanceType,
        EWorkType WorkType,
        ICollection<EGenre> Genres)
    {
        public Guid Id { get; } = Guid.Parse(IdValue);
    }
}
