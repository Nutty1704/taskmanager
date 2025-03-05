import useApiHandler from "./useApiHandler";
import useApiClient from "./useApiClient";

const useChecklistAPI = () => {
    const apiHandler = useApiHandler();
    const apiClient = useApiClient();

    const addItem = (boardId, listId, cardId, checklistId, text) => apiHandler(async () => {
        const response = await apiClient.post("/api/card/checklist/add-item", { boardId, listId, cardId, checklistId, text });
        return response.data.success ? { success: true, updatedChecklist: response.data.data } : { success: false };
    });

    const createChecklist = (cardId, listId, boardId, title) => apiHandler(async () => {
        const response = await apiClient.post("/api/card/checklist/create", { cardId, listId, boardId, title });
        return response.data.success ? { success: true, newChecklist: response.data.data } : { success: false };
    });

    const removeChecklist = (cardId, listId, boardId, checklistId) => apiHandler(async () => {
        const response = await apiClient.post("/api/card/checklist/remove", { cardId, listId, boardId, checklistId });
        return { success: response.data.success };
    });

    const getChecklists = (cardId) => apiHandler(async () => {
        const response = await apiClient.get(`/api/card/${cardId}/checklists`);
        return { success: response.data.success, checklists: response.data.data };
    });

    const removeItem = (boardId, listId, cardId, checklistId, itemId) => apiHandler(async () => {
        const response = await apiClient.post("/api/card/checklist/delete-item", { boardId, listId, cardId, checklistId, itemId });
        return { success: response.data.success };
    });

    const updateItem = (boardId, listId, cardId, checklistId, itemId, text, isCompleted) => apiHandler(async () => {
        const response = await apiClient.post("/api/card/checklist/update-item", { boardId, listId, cardId, checklistId, itemId, text, isCompleted });
        return { success: response.data.success };
    });

    const updateChecklist = (boardId, listId, cardId, checklistId, title) => apiHandler(async () => {
        const response = await apiClient.post("/api/card/checklist/update", { boardId, cardId, listId, checklistId, title });
        return { success: response.data.success };
    });

    return { addItem, createChecklist, removeChecklist, getChecklists, removeItem, updateItem, updateChecklist };
};

export default useChecklistAPI;
