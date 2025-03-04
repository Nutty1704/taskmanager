import useApiHandler from "./useApiHandler";
import useApiClient from "./useApiClient";

const useListAPI = () => {
    const apiHandler = useApiHandler();
    const apiClient = useApiClient();

    const fetchLists = (boardId) => apiHandler(async () => {
        const response = await apiClient.get(`/api/list/${boardId}`);
        return response.data.success ? { success: true, lists: response.data.data } : { success: false, lists: [] };
    });

    const createList = (boardId, title) => apiHandler(async () => {
        const response = await apiClient.post(`/api/list/${boardId}/create`, { title });
        return response.data.success ? { success: true, newList: response.data.data } : { success: false, newList: null };
    });

    const updateList = (boardId, id, title) => apiHandler(async () => {
        const response = await apiClient.post(`/api/list/${boardId}/update`, { id, title });
        return response.data.success ? { success: true, updatedList: response.data.data } : { success: false, updatedList: null };
    });

    const deleteList = (boardId, id) => apiHandler(async () => {
        const response = await apiClient.post(`/api/list/${boardId}/delete`, { id });
        return { success: response.data.success };
    });

    const copyList = (boardId, id) => apiHandler(async () => {
        const response = await apiClient.post(`/api/list/${boardId}/copy`, { id });
        return response.data.success ? { success: true, newList: response.data.data } : { success: false, newList: null };
    });

    const updateListPositions = (boardId, lists) => apiHandler(async () => {
        const items = lists.map(l => ({ _id: l._id, position: l.position }));
        const response = await apiClient.post(`/api/list/${boardId}/positions`, { lists: items });
        return { success: response.data.success };
    });

    return { fetchLists, createList, updateList, deleteList, copyList, updateListPositions };
};

export default useListAPI;
