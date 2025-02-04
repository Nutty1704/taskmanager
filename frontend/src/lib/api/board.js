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


export const getBoard = async (boardId) => {
    try {
        const response = await apiClient.get(`/api/board/${boardId}`);
        return { success: true, board: response.data.data };
    } catch (error) {
        console.error('Error fetching board: ', error.response?.data || error.message);
        return { success: false, board: null };
    }
}


export const updateBoard = async (data) => {
    try {
        const { id, title, isStarred } = data;

        const response = await apiClient.post('/api/board/update', { id, title, isStarred });

        return { success: true, updatedBoard: response.data.data };
    } catch (error) {
        console.error('Error updating board: ', error.response?.data || error.message);
        return { success: false, updatedBoard: null };
    }
}


export const deleteBoard = async (id) => {
    try {
        const response = await apiClient.post('/api/board/delete', { id });

        if (response.data.success) {
            return { success: true };
        }

        return { success: false };
    } catch (error) {
        console.error('Error deleting board: ', error.response?.data || error.message);
        return { success: false };
    }
}
