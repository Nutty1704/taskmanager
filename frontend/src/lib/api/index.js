import useAuthStore from '@/src/stores/useAuthStore';
import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_URL;

if (!baseURL) {
    throw new Error('Backend URL is not defined in .env file');
}

const apiClient = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});


apiClient.interceptors.request.use(
    (config) => {
        const { token } = useAuthStore.getState();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Set the Authorization header
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;