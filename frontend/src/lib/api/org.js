import apiClient from "./index";

export const getAuditLogs = async () => {
    try {
        const response = await apiClient.get("/api/org/audit-logs");
        
        return response.data;
    } catch (error) {
        console.log("Error in getAuditLogs", error);
        throw error;
    }
}