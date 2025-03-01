import apiClient from "./index";

export const addItem = async (cardId, checklistId, text) => {
    try {
        const data = { cardId, checklistId, text };
        const response = await apiClient.post('/api/card/checklist/add-item', data);

        if (!response.data.success) {
            return { success: false };
        } else {
            return { success: true, updatedChecklist: response.data.data };
        }
    } catch (error) {
        console.error("Error in addItem", error);
        return { success: false };
    }
}

export const createChecklist = async (cardId, listId, boardId, title) => {
    try {
        const data = { cardId, listId, boardId, title };
        const response = await apiClient.post('/api/card/checklist/create', data);

        if (!response.data.success) {
            return { success: false };
        }

        return { success: true, newChecklist: response.data.data };
    } catch (error) {
        console.error("Error in createChecklist", error);
        return { success: false };
    }
}

export const removeChecklist = async (cardId, listId, boardId, checklistId) => {
    try {
        const data = { cardId, listId, boardId, checklistId };
        const response = await apiClient.post('/api/card/checklist/remove', data);

        return { success: response.data.success };
    } catch (error) {
        console.error("Error in removeChecklist", error);
        return { success: false };
    }
}

export const getChecklists = async (cardId) => {
    try {
        const response = await apiClient.get(`/api/card/${cardId}/checklists`);

        return { success: response.data.success, checklists: response.data.data };
    } catch (error) {
        console.error("Error in getChecklists", error);
    }
}

export const removeItem = async (cardId, checklistId, itemId) => {
    try {
        const data = { cardId, checklistId, itemId };
        const response = await apiClient.post('/api/card/checklist/delete-item', data);

        return { success: response.data.success };
    } catch (error) {
        console.error("Error in removeItem", error);
        return { success: false };
    }
}

export const updateItem = async (cardId, checklistId, itemId, text, isCompleted) => {
    try {
        const data = { cardId, checklistId, itemId, text, isCompleted };
        const response = await apiClient.post('/api/card/checklist/update-item', data);

        return { success: response.data.success };
    } catch (error) {
        console.error("Error in updateItem", error);
        return { success: false };
    }
}

export const updateChecklist = async (cardId, checklistId, title) => {
    try {
        const data = { cardId, checklistId, title };
        const response = await apiClient.post('/api/card/checklist/update', data);

        return { success: response.data.success };
    } catch (error) {
        console.error("Error in updateChecklist", error);
        return { success: false };
    }
}