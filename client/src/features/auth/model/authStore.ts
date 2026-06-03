import { create } from 'zustand';
import { authApi } from '../api/authApi';
import { useUserStore } from '@entities/user/model/userStore';

interface AuthState {
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (email: string, password: string, name: string) => Promise<boolean>;
    logout: () => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authApi.login(email, password);

            if (response.success && response.user && response.token) {
                localStorage.setItem('token', response.token);
                useUserStore.getState().setUser(response.user);
                useUserStore.getState().setIsAuthenticated(true);
                return true;
            }
            set({ error: response.message || 'Ошибка входа' });
            return false;
        } catch (error: any) {
            set({ error: error.message || 'Ошибка соединения' });
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    register: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authApi.register(email, password, name);

            if (response.success && response.user && response.token) {
                localStorage.setItem('token', response.token);
                useUserStore.getState().setUser(response.user);
                useUserStore.getState().setIsAuthenticated(true);
                return true;
            }
            set({ error: response.message || 'Ошибка регистрации' });
            return false;
        } catch (error: any) {
            set({ error: error.message || 'Ошибка соединения' });
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        useUserStore.getState().logout();
        set({ error: null });
    },

    clearError: () => set({ error: null }),
}));

export const useAuthStoreData = () => ({
    isLoading: useAuthStore((state) => state.isLoading),
    error: useAuthStore((state) => state.error),
    login: useAuthStore.getState().login,
    register: useAuthStore.getState().register,
    logout: useAuthStore.getState().logout,
    clearError: useAuthStore.getState().clearError,
});