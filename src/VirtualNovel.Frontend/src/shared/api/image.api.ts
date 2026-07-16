import type {UploadFileRequest} from "../request/Image.ts";
import {http} from "./http.ts";

type UploadImageResponse = {
    url: string;
};

export async function uploadFile(request: UploadFileRequest): Promise<string> {
    const response = await http.put<UploadImageResponse>("/images", request);
    return response.data.url;
}
