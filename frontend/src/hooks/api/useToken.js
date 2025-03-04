import { useAuth, useSession } from "@clerk/clerk-react";
import { useEffect, useState, useCallback } from "react";

const TOKEN_REFRESH_INTERVAL = 25 * 1000; // 25 seconds

const useToken = () => {
    const [token, setToken] = useState(null);
    const { getToken, orgId } = useAuth();
    const { session } = useSession();

    const fetchToken = useCallback(async () => {
        try {
            const newToken = await getToken();
            setToken(newToken);
        } catch (error) {
            console.error("Failed to fetch token:", error);
            setToken(null);
        }
    }, [getToken, orgId, session]);

    useEffect(() => {
        fetchToken();

        const interval = setInterval(fetchToken, TOKEN_REFRESH_INTERVAL);

        return () => clearInterval(interval);
    }, [fetchToken, orgId, session]);

    return token;
};

export default useToken;
