import axios from "axios";
import {useAuthStore} from "../stores/authStore";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor to add token to requests
apiClient.interceptors.request.use(
    config => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    response => response,
    error => {
        // Handle 401 Unauthorized - token expired or invalid
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

export {apiClient};
