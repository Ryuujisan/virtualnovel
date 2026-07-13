import * as axios from "axios";

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,

    withCredentials: true,

    headers: {
        "Content-Type": "application/json",
    },
})
/*
http.interceptors.request.use(async (config) => {
    const token = await auth.currentUser?.getIdToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
http.interceptors.response.use(
    (response) => response,

    (error) => {
        const status = error.response?.status;

        switch (status) {
            case 401:
                console.log("Unauthorized");
                break;

            case 403:
                console.log("Forbidden");
                break;

            case 404:
                console.log("Not Found");
                break;

            case 500:
                console.log("Server Error");
                break;
        }

        return Promise.reject(error);
    }
);

*/