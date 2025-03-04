import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import useToken from "./useToken";

const baseURL = import.meta.env.VITE_BACKEND_URL;

if (!baseURL) {
    throw new Error("Backend URL is not defined in .env file");
}

const apiClient = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

const GET_NEW_TOKEN_PATHS = [
    "/api/board",
    "/api/org/audit-logs",
    `/api/user/recent-boards`,
    `/api/user/starred-boards`,
];

const useApiClient = () => {
    const token = useToken();
    const { getToken } = useAuth();

    apiClient.interceptors.request.use(
        async (config) => {
            const getNewToken = GET_NEW_TOKEN_PATHS.includes(config.url);

            if (getNewToken || !token) {
                try {
                    const newToken = await getToken();
                    config.headers.Authorization = `Bearer ${newToken}`;
                } catch (error) {
                    console.error("Failed to fetch token:", error);
                }
            } else {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        },
        (error) => Promise.reject(error)
    );

    return apiClient;
};

export default useApiClient;
