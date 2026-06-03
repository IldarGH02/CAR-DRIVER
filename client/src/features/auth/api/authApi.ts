import { api } from '@shared/api/axiosInstance';

export const authApi = {
    login: async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    },

    register: async (email: string, password: string, name: string) => {
        try {
            const response = await api.post('/auth/register', { email, password, name });
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    },
};