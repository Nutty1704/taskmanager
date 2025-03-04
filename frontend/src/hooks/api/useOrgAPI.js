import useApiHandler from "./useApiHandler";
import useApiClient from "./useApiClient";

const useOrgAPI = () => {
    const apiHandler = useApiHandler();
    const apiClient = useApiClient();

    const getAuditLogs = ({ page = 1, limit = 10 }) => apiHandler(async () => {
        const response = await apiClient.get(`/api/org/audit-logs?page=${page}&limit=${limit}`);
            
        return response.data;
    });

    return { getAuditLogs };
}

export default useOrgAPI