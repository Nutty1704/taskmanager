const useApiHandler = () => {
    const handleRequest = async (requestFn) => {
        try {
            return await requestFn();
        } catch (error) {
            console.error("API Error:", error);
            return { success: false, data: [] };
        }
    };

    return handleRequest;
};

export default useApiHandler;
