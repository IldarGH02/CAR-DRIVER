import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@shared/api/axiosInstance';

export interface User {
    id: number;
    email: string;
    name: string;
    role?: string; // Добавляем поле role
    carModel?: string;
    carYear?: string;
    licensePlate?: string;
}

interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setIsLoading: (isLoading: boolean) => void;
    updateUser: (data: Partial<User>) => void;
    logout: () => void;
    fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,

            setUser: (user) => {
                set({ user });
            },

            setIsAuthenticated: (isAuthenticated) => {
                set({ isAuthenticated });
            },

            setIsLoading: (isLoading) => set({ isLoading }),

            updateUser: (data) => set((state) => ({
                user: state.user ? { ...state.user, ...data } : null
            })),

            logout: () => {
                localStorage.removeItem('token');
                set({ user: null, isAuthenticated: false });
            },

            fetchUser: async () => {
                set({ isLoading: true });
                try {
                    const response = await api.get('/auth/me');
                    if (response.data.success && response.data.user) {
                        set({
                            user: {
                                id: response.data.user.id,
                                email: response.data.user.email,
                                name: response.data.user.name,
                                role: response.data.user.role,
                                carModel: response.data.user.carModel,
                                carYear: response.data.user.carYear,
                                licensePlate: response.data.user.licensePlate
                            }
                        });
                    }
                } catch (error) {
                    console.error('Fetch user error:', error);
                } finally {
                    set({ isLoading: false });
                }
            }
        }),
        {
            name: 'user-storage',
        }
    )
);

export const useUserStoreData = () => ({
    user: useUserStore((state) => state.user),
    isAuthenticated: useUserStore((state) => state.isAuthenticated),
    isLoading: useUserStore((state) => state.isLoading),
    setUser: useUserStore.getState().setUser,
    setIsAuthenticated: useUserStore.getState().setIsAuthenticated,
    setIsLoading: useUserStore.getState().setIsLoading,
    updateUser: useUserStore.getState().updateUser,
    logout: useUserStore.getState().logout,
    fetchUser: useUserStore.getState().fetchUser,
});