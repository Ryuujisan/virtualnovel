import type {CreateNovelRequest, UpdateNovelRequest} from "./request.ts";
import type {NovelDto} from "../novels/type.ts";
import {http} from "../../shared/api/http.ts";

export async function createNovel(request : CreateNovelRequest)
: Promise<NovelDto> {
    const response = await http.post<NovelDto>(
        "/novels",
        request
    );
    return response.data;
}

export async function updateNovel(request : UpdateNovelRequest) {
    const response = await http.put("/novels", request);
    return response.data;
}

export async function deleteNovel(id :string) {
    const response = await http.delete(`/novels/`,{
        data : id
    });
    return response.status === 204;
}