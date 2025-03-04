import useApiHandler from "./useApiHandler";
import useApiClient from "./useApiClient";

const useUserAPI = () => {
    const apiHandler = useApiHandler();
    const apiClient = useApiClient();

    const getRecentBoards = () =>
        apiHandler(async () => {
            const response = await apiClient.get(`/api/user/recent-boards`);
            return { success: true, data: response.data.data };
        });

    const getStarredBoards = () =>
        apiHandler(async () => {
            const response = await apiClient.get(`/api/user/starred-boards`);
            return { success: true, data: response.data.data };
        });

    const starBoard = (boardId) =>
        apiHandler(async () => {
            const response = await apiClient.post(
                `/api/user/star-board`,
                { boardId },
            );
            return { success: response.data.success };
        });

    const unstarBoard = (boardId) =>
        apiHandler(async () => {
            const response = await apiClient.post(
                `/api/user/unstar-board`,
                { boardId },
            );
            return { success: response.data.success };
        });

    return { getRecentBoards, getStarredBoards, starBoard, unstarBoard };
};

export default useUserAPI;
