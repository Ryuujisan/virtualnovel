export type CreateNovelRequest ={
    name : string,
    description: string,
    coverUrl? : string,
    romanceType? : string,
    genres : string[],
    workType? : string
}

export type UpdateNovelRequest = {
    novelId : string,
    name? : string,
    description? : string,
    url? : string,
    coverUrl? : string,
    genres? : string[],
    workType? : string,
    romanceType? : string,
}