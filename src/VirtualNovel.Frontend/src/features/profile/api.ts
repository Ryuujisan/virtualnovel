import {http} from "../../shared/api/http.ts";
import type {EnsureProfileRequest} from "./request.ts";


export async function getCurrentUserProfile() {
       var response = await http.get("users/me");
       return response.data;
}

export async function getProfiles(id: string){
       var response = await http.get(`users/${id}`);
       return response.data;
}


export async function updateProfile(profile: EnsureProfileRequest){
       const response = await http.put("/users", profile);
       return response.data;
}