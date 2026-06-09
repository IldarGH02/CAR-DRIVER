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

    // ✅ Добавляем отправку кода верификации
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
            return response.data; // Теперь возвращает { success, token, user }
        } catch (error: any) {
            console.error('❌ Verify code error:', error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to verify code'
            };
        }
    }
};