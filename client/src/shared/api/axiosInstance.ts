import axios from 'axios';

const getBaseURL = () => {
    if (import.meta.env.PROD) {
        return import.meta.env.VITE_API_URL || '/api';
    }
    return import.meta.env.VITE_API_URL || 'https://ildargh02-car-driver-2f75.twc1.net/api';
};

const API_URL = getBaseURL();

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.error('Axios response error:', {
            status: error.response?.status,
            url: error.config?.url,
            method: error.config?.method,
            data: error.response?.data
        });

        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user-storage');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);