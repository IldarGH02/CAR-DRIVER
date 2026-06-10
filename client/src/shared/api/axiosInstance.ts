import axios from 'axios';

const getBaseURL = () => {
    if (import.meta.env.PROD) {
        return import.meta.env.VITE_API_URL || '/api';
    }
    return import.meta.env.VITE_API_URL || 'https://ildargh02-car-driver-2f75.twc1.net/api';
};

const API_URL = getBaseURL();

console.log('API URL:', API_URL);

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

    if (config.method === 'get') {
        config.params = {
            ...config.params,
            _t: Date.now()
        };
    }

    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
});

api.interceptors.response.use(
    (response) => {
        console.log(`📥 ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
        return response;
    },
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