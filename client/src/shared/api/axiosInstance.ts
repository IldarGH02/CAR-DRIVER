import axios from 'axios';

// Используем переменную окружения для API URL с правильной типизацией
const API_URL = 'https://ildargh02-car-driver-2f75.twc1.net';

console.log('🔧 API URL:', API_URL); // Для отладки

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // Увеличил таймаут для сервера
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        console.error('Axios response error:', error.response?.status, error.response?.data);
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user-storage');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);