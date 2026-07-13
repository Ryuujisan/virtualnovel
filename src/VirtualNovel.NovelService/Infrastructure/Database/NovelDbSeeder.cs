using Microsoft.EntityFrameworkCore;
using VirtualNovel.NovelService.Entities;

namespace VirtualNovel.NovelService.Infrastructure.Database;

public static class NovelDbSeeder
{
    private const int SeedNovelCount = 100;
    private const int RandomSeed = 7421;
    private const string CurrentSeedPrefix = "20000001";

    private static readonly string[] Titles =
    [
        "Archiwum Deszczowego Miasta",
        "Ostatnia Stacja Helios",
        "Herbaciarnia na Końcu Lata",
        "Dom, Który Oddycha Nocą",
        "Żelazny Żuraw",
        "Biblioteka Utraconych Imion",
        "Między Orbitami",
        "Siedem Listów do Zimy",
        "Królestwo z Papieru",
        "Cisza pod Lodem",
        "Kwiaty dla Mechanicznej Bogini",
        "Akademia Drugiej Szansy",
        "Nocny Pociąg do Aster",
        "Smoczy Dług",
        "Echo po Północy",
        "Latarnia na Morzu Chmur",
        "Kronikarz Złamanej Korony",
        "Kawiarnia dla Zagubionych Duchów",
        "Córka Gwiezdnego Kowala",
        "Miasto Bez Wschodu Słońca",
        "Strażniczka Dziewiątej Bramy",
        "Wiosna po Końcu Świata",
        "Złodziejka Cudzych Snów",
        "Turniej Szkarłatnego Feniksa",
        "Pamiętnik Ostatniego Alchemika",
        "Księżyc nad Akademią Seiran",
        "Gildia Bohaterów na Pół Etatu",
        "Obietnica złożona Smokowi",
        "Księżniczka Pustynnego Wiatru",
        "Szept Lasu Tysiąca Dróg",
        "Requiem dla Sztucznego Serca",
        "Władca Demonów Prowadzi Piekarnię",
        "Atlas Krain, Których Nie Ma",
        "Rycerz bez Imienia",
        "Melodia z Drugiej Strony Lustra",
        "Alchemiczka z Ulicy Jaśminowej",
        "Przebudzenie Białego Tygrysa",
        "Dziennik Łowcy Komety",
        "Podróżniczka z Jutra",
        "Wieża, Która Pamięta",
        "Mój Sąsiad jest Nekromantą",
        "Korona z Popiołu i Śniegu",
        "Sekret Księżycowego Ogrodu",
        "Dziedziczka Burzowego Klanu",
        "Operator Numer Siedem",
        "Zanim Zakwitną Czarne Róże",
        "Pocztmistrz Między Światami",
        "Szkoła Magii dla Spóźnionych",
        "Wilczyca z Cesarstwa Jadeitu",
        "Ocean pod Szklanym Niebem",
        "Przewodnik po Nawiedzonych Peronach",
        "Cesarzowa Małych Katastrof",
        "Łowca Potworów i Zaginiony Kot",
        "Pieśń Kryształowego Smoka",
        "Reset o Północy",
        "Mistrzyni Miecza z Herbaciarni",
        "Gwiazdy nad Dzielnicą Portową",
        "Duch w Sieci Akademii",
        "Zielarka z Zakazanego Lasu",
        "Kontrakt z Bogiem Przypadku",
        "Trzy Życzenia dla Antybohatera",
        "Książę Północnej Granicy",
        "Detektyw od Niemożliwych Zbrodni",
        "Mechaniczne Skrzydła Iris",
        "Wyspa, Która Pojawia się Jesienią",
        "Siódmy Uczeń Arcymaga",
        "Kiedy Milkną Syreny Alarmowe",
        "Narzeczona Króla Cieni",
        "Kurierzy Końca Świata",
        "Klub Czytelniczy Apokalipsy",
        "Róża na Polu Bitwy",
        "Hotel dla Podróżników w Czasie",
        "Północny Wiatr Niesie Imiona",
        "Schronisko dla Upadłych Bóstw",
        "Kod Błękitnego Księżyca",
        "Miasteczko po Drugiej Stronie Mapy",
        "Przysięga Ostatniej Walkirii",
        "Sto Dni do Festiwalu Gwiazd",
        "Cień Białej Cesarzowej",
        "Wypożyczalnia Magicznych Towarzyszy",
        "Smak Deszczu na Marsie",
        "Księga Zakazanych Zakończeń",
        "Dzwony nad Doliną Mgły",
        "Bohater, Który Odmówił Wyroczni",
        "Dom Sierot dla Małych Smoków",
        "Ogród na Dachu Wszechświata",
        "Krawcowa Królewskich Wspomnień",
        "Niebieski Ptak z Sektora Zero",
        "Miecz dla Pokojowej Kapłanki",
        "Letnia Akademia Duchów",
        "Agentka Biura Anomalii",
        "Piąta Pora Roku",
        "Kroniki Wędrownej Czarownicy",
        "Skarb Kapitana Bez Załogi",
        "Dwie Minuty po Końcu Czasu",
        "Księgarnia Otwarta Tylko Nocą",
        "Legenda o Szklanym Lisie",
        "Projekt Aurora",
        "Powrót na Wyspę Szeptów",
        "Ostatni Rozdział Przed Świtem"
    ];

    private static readonly string[] Premises =
    [
        "Młoda kartografka odnajduje drogę do miasta wymazanego ze wszystkich map.",
        "Załoga odległej stacji odbiera sygnał, który nie powinien jeszcze istnieć.",
        "Spokojna właścicielka herbaciarni odkrywa, że życzenia gości mają ukrytą cenę.",
        "Grupa studentów zamieszkuje dom, w którym każdej nocy pojawia się nowy pokój.",
        "Kurierka przemierza krainę walczących klanów z listem zdolnym zakończyć wojnę.",
        "Bibliotekarz trafia na księgę zapisującą imiona ludzi, o których świat ma zapomnieć.",
        "Dwoje rywalizujących pilotów zostaje uwięzionych na uszkodzonym statku.",
        "Po latach nieobecności fotografka otrzymuje wiadomość od zaginionej przyjaciółki.",
        "Uczeń introligatora trafia do krainy zbudowanej z niedokończonych opowieści.",
        "Ekspedycja badawcza znajduje pod lodem ślady cywilizacji starszej od ludzkości.",
        "Mechaniczka naprawia starożytnego automata, który bierze ją za swoją kapłankę.",
        "Uczniowie akademii budzą się ze wspomnieniami katastrofy mającej nadejść za sto dni.",
        "Konduktor pociągu kursującego między snami szuka pasażerki, która się nie obudziła.",
        "Łowczyni smoków musi ochronić stworzenie należące do gatunku, który miała zgładzić.",
        "Prowadząca nocną audycję słyszy od słuchaczy opisy wydarzeń z następnego dnia.",
        "Strażniczka samotnej latarni odkrywa flotę ukrytą ponad chmurami.",
        "Młody kronikarz poznaje prawdziwą historię dynastii, której miał wiernie służyć.",
        "Kelnerka dostrzega, że niektórzy goście kawiarni nie należą już do świata żywych.",
        "Córka kowala potrafi przekuwać spadające gwiazdy w broń spełniającą obietnice.",
        "W mieście pogrążonym w wiecznej nocy zegarmistrz próbuje uruchomić dawne słońce."
    ];

    private static readonly string[] Complications =
    [
        "Każdy kolejny trop podważa jednak wszystko, co dotąd uważała za prawdę.",
        "Pomoc oferuje dawny rywal, którego intencje pozostają niejasne.",
        "Na rozwiązanie zagadki zostało zaledwie siedem dni.",
        "Cena porażki dotknie nie tylko bohaterów, lecz także ludzi, których chcą ochronić.",
        "Wyprawa szybko zamienia się w próbę lojalności i trudnych wyborów.",
        "Najważniejszą wskazówkę skrywa osoba, której nikt nie chce zaufać.",
        "Tymczasem granica między wspomnieniem a rzeczywistością zaczyna zanikać.",
        "Każde użycie niezwykłej mocy przybliża katastrofę, której miała zapobiec.",
        "Sekret sprzed lat łączy wszystkich uczestników wydarzeń bardziej, niż przypuszczali.",
        "Aby wrócić do domu, trzeba najpierw zdecydować, który świat naprawdę nim jest."
    ];

    private static readonly string[] ChapterTitles =
    [
        "Nieoczekiwany list", "Ślad na mapie", "Gość po zmroku",
        "Cena obietnicy", "Droga przez mgłę", "Głos zza drzwi",
        "Dzień bez cienia", "Ostatni pociąg", "Pęknięte lustro",
        "Sekret starego mostu", "Powrót posłańca", "Burza nad miastem",
        "Ukryta wiadomość", "Nocna rozmowa", "Próba zaufania",
        "Światło na horyzoncie"
    ];

    private static readonly string[] ChapterDevelopments =
    [
        "Bohaterowie odkrywają wskazówkę, która zmienia znaczenie ich dotychczasowej podróży.",
        "Spokojny plan rozpada się, gdy pojawia się ktoś znający prawdziwy cel wyprawy.",
        "Dawny konflikt wraca w najmniej odpowiednim momencie i wymusza trudny wybór.",
        "Rozmowa, która miała przynieść odpowiedzi, ujawnia kolejną warstwę tajemnicy.",
        "Pozornie niewielka decyzja uruchamia wydarzenia, których nie da się zatrzymać.",
        "Nowy sojusznik oferuje pomoc, lecz jego wersja wydarzeń nie zgadza się z faktami."
    ];

    public static async Task SeedAsync(
        IServiceProvider services,
        CancellationToken cancellationToken = default)
    {
        await using var scope = services.CreateAsyncScope();
        var environment = scope.ServiceProvider.GetRequiredService<IHostEnvironment>();
        var logger = scope.ServiceProvider
            .GetRequiredService<ILoggerFactory>()
            .CreateLogger(nameof(NovelDbSeeder));

        if (!environment.IsDevelopment())
        {
            logger.LogInformation(
                "Novel development seed skipped because environment is {EnvironmentName}.",
                environment.EnvironmentName);
            return;
        }

        var dbContext = scope.ServiceProvider.GetRequiredService<NovelDbContext>();
        var seedNow = DateTime.UtcNow.Date.AddHours(18);
        var specifications = CreateSpecifications(seedNow);
        var seedIds = specifications.Select(item => item.Id).ToArray();
        var expectedChapterCount = specifications.Sum(item => item.ChapterCount);
        var expectedRatingCount = specifications.Sum(item => item.RatingCount);

        var existingNovelCount = await dbContext.Novels
            .CountAsync(novel => seedIds.Contains(novel.Id), cancellationToken);
        var existingChapterCount = await dbContext.Chapters
            .CountAsync(chapter => seedIds.Contains(chapter.NovelId), cancellationToken);
        var existingRatingCount = await dbContext.Ratings
            .CountAsync(rating => seedIds.Contains(rating.NovelId), cancellationToken);

        if (existingNovelCount == specifications.Count &&
            existingChapterCount == expectedChapterCount &&
            existingRatingCount == expectedRatingCount)
        {
            logger.LogInformation(
                "Novel development seed skipped: complete dataset already exists " +
                "({NovelCount} novels, {ChapterCount} chapters, {RatingCount} ratings).",
                existingNovelCount,
                existingChapterCount,
                existingRatingCount);
            return;
        }

        var legacyIds = Enumerable.Range(1, 15)
            .Select(index => CreateSeedGuid("10000000", index))
            .Concat(Enumerable.Range(1, SeedNovelCount)
                .Select(index => CreateSeedGuid("20000000", index)))
            .ToArray();
        var idsToReplace = legacyIds.Concat(seedIds).ToArray();

        await using var transaction = await dbContext.Database
            .BeginTransactionAsync(cancellationToken);
        var removedNovelCount = await dbContext.Novels
            .Where(novel => idsToReplace.Contains(novel.Id))
            .ExecuteDeleteAsync(cancellationToken);

        if (removedNovelCount > 0)
        {
            logger.LogInformation(
                "Removed {NovelCount} records from the previous or incomplete novel seed.",
                removedNovelCount);
        }

        var novels = specifications
            .Select((specification, index) => CreateNovel(specification, index))
            .ToList();

        dbContext.Novels.AddRange(novels);
        await dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        logger.LogInformation(
            "Novel development seed created {NovelCount} novels, " +
            "{ChapterCount} chapters and {RatingCount} ratings.",
            novels.Count,
            novels.Sum(novel => novel.Chapters.Count),
            novels.Sum(novel => novel.Ratings.Count));
    }

    private static IReadOnlyList<NovelSeed> CreateSpecifications(DateTime seedNow)
    {
        var genres = Enum.GetValues<EGenre>();
        var result = new List<NovelSeed>(SeedNovelCount);

        for (var index = 0; index < SeedNovelCount; index++)
        {
            var chapterCount = GetChapterCount(index);
            var ratingCount = index % 10 == 0 ? 0 : index * 13 % 41;
            var createdDaysAgo = 10 + index * 47 % 530;
            var createdAt = seedNow
                .AddDays(-createdDaysAgo)
                .AddHours(-(index % 18));
            var updatedAt = GetUpdatedAt(seedNow, createdAt, index);
            var genreCount = 1 + index * 7 % 6;
            var selectedGenres = Enumerable.Range(0, genreCount)
                .Select(offset => genres[(index * 7 + offset * 5) % genres.Length])
                .Distinct()
                .ToArray();

            result.Add(new NovelSeed(
                CreateSeedGuid(CurrentSeedPrefix, index + 1),
                GetAuthorId(index),
                Titles[index],
                $"{Premises[index % Premises.Length]} " +
                Complications[index / Premises.Length % Complications.Length],
                index % 13 == 0
                    ? null
                    : $"https://picsum.photos/seed/virtual-novel-{index + 1:000}/640/960",
                GetStatus(index),
                (ERomanceType)(index % Enum.GetValues<ERomanceType>().Length),
                index % 4 == 0 || index % 11 == 0
                    ? EWorkType.Fanfiction
                    : EWorkType.Original,
                selectedGenres,
                createdAt,
                updatedAt,
                chapterCount,
                ratingCount));
        }

        return result;
    }

    private static Novel CreateNovel(NovelSeed specification, int seedIndex)
    {
        var random = new Random(RandomSeed + seedIndex * 97);
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
            CreatedAt = specification.CreatedAt,
            UpdatedAt = specification.UpdatedAt
        };

        novel.Chapters = Enumerable.Range(1, specification.ChapterCount)
            .Select(order => CreateChapter(novel, seedIndex, order, specification.ChapterCount))
            .ToList();
        novel.Ratings = Enumerable.Range(1, specification.RatingCount)
            .Select(ratingIndex => CreateRating(novel, seedIndex, ratingIndex, random))
            .ToList();

        return novel;
    }

    private static Chapter CreateChapter(
        Novel novel,
        int seedIndex,
        int order,
        int chapterCount)
    {
        var description = ChapterDevelopments[(seedIndex + order) % ChapterDevelopments.Length];
        var progress = (double)order / chapterCount;
        var publishedAt = novel.CreatedAt.AddTicks(
            (long)((novel.UpdatedAt - novel.CreatedAt).Ticks * progress));

        return new Chapter
        {
            Id = CreateChildGuid("21000000", seedIndex + 1, order),
            Novel = novel,
            Order = order,
            Name = $"{order}. {ChapterTitles[(seedIndex + order - 1) % ChapterTitles.Length]}",
            Description = description,
            Content = $"{description}\n\n" +
                      "To krótka treść rozdziału przygotowana do testowania widoku czytnika. " +
                      "Scena rozwija główny wątek i pozostawia bohaterów przed kolejną decyzją.",
            CreatedAt = publishedAt,
            UpdatedAt = publishedAt
        };
    }

    private static Rating CreateRating(
        Novel novel,
        int seedIndex,
        int ratingIndex,
        Random random)
    {
        var rate = (seedIndex % 3) switch
        {
            0 => random.Next(4, 6),
            1 => random.Next(2, 6),
            _ => random.Next(1, 4)
        };

        return new Rating
        {
            Id = CreateChildGuid("22000000", seedIndex + 1, ratingIndex),
            UserId = $"seed-rating-user-{ratingIndex:00}",
            Novel = novel,
            Rate = rate
        };
    }

    private static DateTime GetUpdatedAt(DateTime seedNow, DateTime createdAt, int index)
    {
        if (index % 12 < 3)
        {
            return seedNow.AddDays(-(index / 12 * 14));
        }

        var lifetimeDays = Math.Max(1, (seedNow - createdAt).Days);
        var updatedDaysAgo = 1 + index * 19 % lifetimeDays;
        return seedNow.AddDays(-updatedDaysAgo).AddHours(-(index % 12));
    }

    private static int GetChapterCount(int index) => index switch
    {
        0 => 1,
        1 => 2,
        2 => 3,
        3 => 5,
        4 => 10,
        17 => 318,
        29 => 240,
        43 => 347,
        64 => 275,
        78 => 305,
        _ => 1 + index * 37 % 190
    };

    private static EStatus GetStatus(int index) => (index % 10) switch
    {
        <= 4 => EStatus.Publishing,
        5 or 6 or 9 => EStatus.Complete,
        7 => EStatus.Hiatus,
        _ => EStatus.Abandoned
    };

    private static string GetAuthorId(int index) => index switch
    {
        < 36 => "seed-user-01",
        < 54 => "seed-user-02",
        < 66 => "seed-user-03",
        < 76 => "seed-user-04",
        < 84 => "seed-user-05",
        < 90 => "seed-user-06",
        < 95 => "seed-user-07",
        < 98 => "seed-user-08",
        < 99 => "seed-user-09",
        _ => "seed-user-10"
    };

    private static Guid CreateSeedGuid(string prefix, int index) =>
        Guid.Parse($"{prefix}-0000-0000-0000-{index:000000000000}");

    private static Guid CreateChildGuid(string prefix, int novelIndex, int childIndex) =>
        Guid.Parse($"{prefix}-0000-{novelIndex:X4}-0000-{childIndex:X12}");

    private sealed record NovelSeed(
        Guid Id,
        string AuthorId,
        string Title,
        string Description,
        string? CoverUrl,
        EStatus Status,
        ERomanceType RomanceType,
        EWorkType WorkType,
        ICollection<EGenre> Genres,
        DateTime CreatedAt,
        DateTime UpdatedAt,
        int ChapterCount,
        int RatingCount);
}
