export type NovelCardInfo = {
    id: string
    title: string
    coverUrl: string
    rating: number
}
export type NovelFeed = {
    id: string;
    author: {
        authorId: string;
        name: string;
        avatarUrl: string | null;
    };
    title: string;
    description: string;
    coverUrl: string | null;
    rating: number;
    status: string;
    romance: string;
    genres: string[];
    updatedAt: string;
};
