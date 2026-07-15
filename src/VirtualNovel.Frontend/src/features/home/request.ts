export type NovelQuery = {
    genre?: string[];
    romance?: string;
    author?: string,
    status?: string;
    sort?: string;
    page: number;
    pageSize: number;
};