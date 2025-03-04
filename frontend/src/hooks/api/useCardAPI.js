import useApiHandler from "./useApiHandler";
import useApiClient from "./useApiClient";

const useCardAPI = () => {
    const apiHandler = useApiHandler();
    const apiClient = useApiClient();

    const createCard = (data) => apiHandler(async () => {
        const response = await apiClient.post("/api/card/create", data);
        return response.data.success ? { success: true, newCard: response.data.data } : { success: false, newCard: null };
    });

    const moveCard = (boardId, moveCardId, data) => apiHandler(async () => {
        const { srcList, destList } = data;
        const response = await apiClient.post("/api/card/move", { boardId, moveCardId, srcList, destList });
        return { success: response.data.success };
    });

    const fetchCard = (boardId, listId, cardId) => apiHandler(async () => {
        const response = await apiClient.post("/api/card/get", { boardId, listId, cardId });
        return response.data.success ? { success: true, card: response.data.data } : { success: false, card: null };
    });

    const updateCard = (data) => apiHandler(async () => {
        const response = await apiClient.post("/api/card/update", data);
        return { success: response.data.success };
    });

    const copyCard = (data) => apiHandler(async () => {
        const response = await apiClient.post("/api/card/copy", data);
        return response.data.success ? { success: true, newCard: response.data.data } : { success: false, newCard: null };
    });

    const deleteCard = (data) => apiHandler(async () => {
        const response = await apiClient.post("/api/card/delete", data);
        return { success: response.data.success };
    });

    const fetchCardAuditLog = (cardId) => apiHandler(async () => {
        const response = await apiClient.get(`/api/card/${cardId}/logs`);
        return response.data.success ? { success: true, logs: response.data.data } : { success: false, logs: [] };
    });

    const modifyCardLabels = (boardId, cardId, listId, labelId, checked) => apiHandler(async () => {
        const response = await apiClient.post("/api/card/modify-label", { boardId, cardId, listId, labelId, checked });
        return { success: response.data.success };
    });

    const updateAssignees = (boardId, listId, cardId, assignees) => apiHandler(async () => {
        const response = await apiClient.post("/api/card/update-assignees", { boardId, cardId, listId, assignees });
        return { success: response.data.success, updatedCard: response.data.data };
    });

    return { 
        createCard, 
        moveCard, 
        fetchCard, 
        updateCard, 
        copyCard, 
        deleteCard, 
        fetchCardAuditLog, 
        modifyCardLabels, 
        updateAssignees 
    };
};

export default useCardAPI;