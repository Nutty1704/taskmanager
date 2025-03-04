import useApiClient from "./useApiClient";
import useApiHandler from "./useApiHandler";

const useBoardAPI = () => {
    const apiHandler = useApiHandler();
    const apiClient = useApiClient();

    const createBoard = (data) =>
        apiHandler(async () => {
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
        });

    const getBoards = () =>
        apiHandler(async () => {
            const response = await apiClient.get('/api/board');
            return { success: true, boards: response.data.data };
        });

    const getBoard = (boardId) =>
        apiHandler(async () => {
            const response = await apiClient.get(`/api/board/${boardId}`);
            return { success: true, board: response.data.data };
        });

    const updateBoard = (data) =>
        apiHandler(async () => {
            const { id, title, isStarred } = data;

            const response = await apiClient.post('/api/board/update', { id, title, isStarred });

            return { success: true, updatedBoard: response.data.data };
        });

    const deleteBoard = (id) =>
        apiHandler(async () => {
            const response = await apiClient.post('/api/board/delete', { id });

            return { success: response.data.success };
        });

    const getBoardLabels = (boardId) =>
        apiHandler(async () => {
            const response = await apiClient.get(`/api/board/${boardId}/labels`);
            return { success: true, labels: response.data.data };
        });

    const updateBoardLabel = (boardId, labelId, title, color) =>
        apiHandler(async () => {
            const response = await apiClient.put(`/api/board/${boardId}/label`, { labelId, title, color });

            return { success: response.data.success, newLabel: response.data.data };
        });

    const deleteBoardLabel = (boardId, labelId) =>
        apiHandler(async () => {
            const response = await apiClient.delete(`/api/board/${boardId}/label/${labelId}`);

            return { success: response.data.success };
        });

    return {
        createBoard,
        getBoards,
        getBoard,
        updateBoard,
        deleteBoard,
        getBoardLabels,
        updateBoardLabel,
        deleteBoardLabel
    };
};

export default useBoardAPI;
