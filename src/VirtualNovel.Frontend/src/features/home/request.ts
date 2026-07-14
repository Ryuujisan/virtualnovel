export type NovelQuery = {
    genre?: string[];
    romance?: string;
    status?: string;
    sort?: string;
    page: number;
    pageSize: number;
};