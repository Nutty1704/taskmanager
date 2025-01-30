import apiClient from './index';

export const fetchLists = async (boardId) => {
    try {
        const response = await apiClient.get(`/api/list/${boardId}`);

        if (response.data.success) {
            return { success: true, lists: response.data.data };
        }

        return { success: false, lists: [] };

    } catch (error) {
        console.error('Error fetching lists: ', error.response?.data || error.message);
        return { success: false, lists: null };
    }
}


export const createList = async (data) => {
    try {
        const { boardId, title } = data;

        const response = await apiClient.post(`/api/list/${boardId}/create`, { title });

        if (response.data.success) {
            return { success: true, newList: response.data.data };
        }

        return { success: false, newList: null };

    } catch (error) {
        console.error('Error creating list: ', error.response?.data || error.message);
        return { success: false, newList: null };
    }
}


export const updateList = async (boardId, data) => {
    try {
        const { id, title } = data;

        if (!boardId || !id || !title) {
            console.log(boardId);
            console.log(id);
            console.log(title);
            throw new Error('Invalid data');
        }

        const response = await apiClient.post(`/api/list/${boardId}/update`, { id, title });

        if (response.data.success) {
            return { success: true, updatedList: response.data.data };
        }
    } catch (error) {
        console.error('Error updating list: ', error.response?.data || error.message);
        return { success: false, updatedList: null };
    }
}


export const deleteList = async (boardId, id) => {
    try {
        const response = await apiClient.post(`/api/list/${boardId}/delete`, { id });

        if (response.data.success) {
            return { success: true };
        }

        return { success: false };
    } catch (error) {
        console.error('Error deleting list: ', error.response?.data || error.message);
        return { success: false };
    }
}


export const copyList = async (boardId, id) => {
    try {
        const response = await apiClient.post(`/api/list/${boardId}/copy`, { id });

        if (response.data.success) {
            return { success: true, newList: response.data.data };
        }

        return { success: false, newList: null };
    } catch (error) {
        console.error('Error copying list: ', error.response?.data || error.message);
        return { success: false, newList: null };
    }
}