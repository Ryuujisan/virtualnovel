
import type {NovelFeed} from "../../features/home/Type.ts";
import {http} from "../../shared/api/http.ts";
import type {NovelQuery} from "./request.ts";
export async function getNovels(
    query: NovelQuery,
): Promise<NovelFeed[]>
{
    const response = await http.get<NovelFeed[]>("/novels", {
        params: {
            genre: query.genre?.join(","),
            romance: query.romance,
            status: query.status,
            sort: query.sort,
            page: query.page,
            pageSize: query.pageSize,
        },
    });

    return response.data;
}