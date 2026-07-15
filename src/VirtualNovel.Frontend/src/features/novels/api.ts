import {http} from "../../shared/api/http.ts";
import type {NovelDto} from "./type.ts";


export async function getNovel(id: string): Promise<NovelDto> {
    const response = await http.get<NovelDto>(`/novels/${id}`);
    return response.data;
}
