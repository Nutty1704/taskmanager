import useApiHandler from "./useApiHandler";
import useApiClient from "./useApiClient";

const useOrgAPI = () => {
    const apiHandler = useApiHandler();
    const apiClient = useApiClient();

    const getAuditLogs = () => apiHandler(async (token) => {
        const response = await apiClient.get("/api/org/audit-logs");
            
        return response.data;
    });

    return { getAuditLogs };
}

export default useOrgAPI