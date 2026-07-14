import {http} from "./http.ts";

export async function getChapter(id: string, order: string) {
    const response = await http.get(`/novels/${id}/chapters/${order}`);
    return response.data
}