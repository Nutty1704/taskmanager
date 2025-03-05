import useApiHandler from "./useApiHandler";
import useApiClient from "./useApiClient";
import { defaultImages } from '@/src/config/images';

const useUnsplashAPI = () => {
    const apiHandler = useApiHandler();
    const apiClient = useApiClient();

    const getRandomImages = (numImages = 9) => apiHandler(async () => {
        try {
            const response = await apiClient.post("/api/unsplash/random", { numImages });
            return response.data.data;     
        } catch (error) {
            return defaultImages;
        }
    });

    return { getRandomImages };
};

export default useUnsplashAPI;
