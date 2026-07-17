export type CreateChapterRequest = {
    novelId : string,
    chapterName : string,
    chapterDescription : string,
    content : string,
}

export type UpdateChapterRequest = {
    id : string,
    chapterName : string,
    chapterDescription : string ,
    content : string,
    order? : -1 | number,
}

export type ReorderChapterRequest = {
    chapterId: string,
    newOrder: number,
}
