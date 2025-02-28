import apiClient from './index'

export const getRecentBoards = async () => {
    try {
        const response = await apiClient.get(`/api/user/recent-boards`);

        return { success: true, data: response.data.data };
    } catch (error) {
        next(error);
    }
}

export const getStarredBoards = async () => {
    try {
        const response = await apiClient.get(`/api/user/starred-boards`);

        return { success: true, data: response.data.data };
    } catch (error) {
        console.log("Error in getStarredBoards", error);
        return { success: false, data: [] };
    }
}

export const starBoard = async (boardId) => {
    try {
        const response = await apiClient.post(`/api/user/star-board`, { boardId });

        return { success: response.data.success };
    } catch (error) {
        console.error("Error in starBoard", error);
        return { success: false };
    }
}

export const unstarBoard = async (boardId) => {
    try {
        const response = await apiClient.post(`/api/user/unstar-board`, { boardId });

        return { success: response.data.success };
    } catch (error) {
        console.error("Error in starBoard", error);
        return { success: false };
    }
}