import useApiHandler from "./useApiHandler";
import useApiClient from "./useApiClient";

const useUnsplashAPI = () => {
    const apiHandler = useApiHandler();
    const apiClient = useApiClient();

    const getRandomImages = (numImages = 9) => apiHandler(async () => {
        const response = await apiClient.post("/api/unsplash/random", { numImages });
        return response.data.data;
    });

    return { getRandomImages };
};

export default useUnsplashAPI;
