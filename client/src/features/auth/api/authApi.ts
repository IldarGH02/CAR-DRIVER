import { api } from '@shared/api/axiosInstance';
import { useUserStore } from '@entities/user/model/userStore';

export const authApi = {
    login: async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/login', { email, password });

            if (response.data.success && response.data.token && response.data.user) {
                localStorage.setItem('token', response.data.token);
                useUserStore.getState().setUser(response.data.user);
                useUserStore.getState().setIsAuthenticated(true);
            }

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

    sendVerificationCode: async (email: string) => {
        try {
            const response = await api.post('/auth/send-code', { email });
            return response.data;
        } catch (error: any) {
            console.error('Send verification code error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to send verification code'
            };
        }
    },

    verifyCode: async (email: string, code: string) => {
        try {
            const response = await api.post('/auth/verify-code', { email, code });
            console.log('✅ Verify code response:', response.data);

            if (response.data.success && response.data.token && response.data.user) {
                // ✅ ЗДЕСЬ сохраняем токен только после успешной верификации
                localStorage.setItem('token', response.data.token);
                useUserStore.getState().setUser(response.data.user);
                useUserStore.getState().setIsAuthenticated(true);
            }

            return response.data;
        } catch (error: any) {
            console.error('❌ Verify code error:', error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to verify code'
            };
        }
    }
};