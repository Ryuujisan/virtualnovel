import {http} from "../../shared/api/http.ts";
import type {CreateChapterRequest, UpdateChapterRequest} from "./request.ts";
import type {ChapterDto} from "./type.ts";

export async function getChapter(id: string, order: string) :Promise<ChapterDto> {
    const response = await http.get(`/novels/${id}/chapters/${order}`);
    return response.data
}

export async function getChapterById(id: string) :Promise<ChapterDto> {
    const response = await http.get<ChapterDto>(`/chapters/${id}`);
    return response.data
}

export async function createChapter(req: CreateChapterRequest) : Promise<ChapterDto>  {
    const response = await http.post<ChapterDto>(`/chapters/`, req);
    return response.data
}

export async function updateChapter(req: UpdateChapterRequest) : Promise<ChapterDto>  {
    const response = await http.put<ChapterDto>(`/chapters/`, req);
    return response.data
}