import apiClient from "./index"

export const getRandomImages = async (numImages = 9) => {
    try {
        const response = await apiClient.post('/api/unsplash/random', {
            numImages
        });

        return response.data.data;
    } catch (error) {
        console.error('Error fetching random images: ', error.response?.data || error.message);
    }
}