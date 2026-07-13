import {http} from "./http.ts";

export async function getNovel(id: string) {
    const response = await http.get(`/novels/${id}`)
    return response.data
}