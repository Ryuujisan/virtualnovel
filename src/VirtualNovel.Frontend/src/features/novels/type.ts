

export type ChapterFeedDto = {
    id: string; // Guid w C# mapuje się na string (format UUID)
    title: string;
    order: number;
}

export type AuthorPreviewDto = {
    authorId: string;
    name: string;
    avatarUrl: string | null;
}

export type NovelDto = {
    id: string;
    author: AuthorPreviewDto;
    title: string;
    description: string;
    coverUrl: string | null; // Może być null, jeśli nowelka nie ma jeszcze okładki
    rating: number; // float w C# to po prostu number w TS
    status: string;
    romanceType: string;
    workType: string;
    genres: string[]; // ICollection<EGenre> staje się zwykłą tablicą
    chapters: ChapterFeedDto[];
    createdAt: string; // DateTime z JSON-a przychodzi jako string ISO-8601
    updatedAt: string;
}
