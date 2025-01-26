import apiClient from './index'

export const createBoard = async (data) => {
    try {
        const { title, image } = data;

        const [
            imageId,
            imageThumbUrl,
            imageFullUrl,
            imageLinkHTML,
            imageUserName
        ] = image.split('|');

        if (!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName) {
            throw new Error('Invalid image data');
        }

        const response = await apiClient.post('/api/board/create', {
            title,
            imageId,
            imageThumbUrl,
            imageFullUrl,
            imageLinkHTML,
            imageUserName
        });

        return { success: true, newBoard: response.data.data };
    } catch (error) {
        console.error('Error creating board: ', error.response?.data || error.message);
        return { success: false, newBoard: null };
    }
}


export const getBoards = async () => {
    try {
        const response = await apiClient.get('/api/board');
        return { success: true, boards: response.data.data };
    } catch (error) {
        console.error('Error fetching boards: ', error.response?.data || error.message);
        return { success: false, boards: null };
    }
}