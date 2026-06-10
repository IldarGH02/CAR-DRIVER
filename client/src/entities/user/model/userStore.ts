import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@shared/api/axiosInstance';

export interface User {
    id: number;
    email: string;
    name: string;
    role?: string;
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
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,

            setUser: (user) => {
                set({ user, isAuthenticated: !!user });
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
                // Если уже есть пользователь и он не истек, не делаем запрос
                const currentUser = get().user;
                if (currentUser && currentUser.id !== undefined) {
                    console.log('User already loaded, skipping fetch');
                    set({ isLoading: false });
                    return;
                }

                set({ isLoading: true });
                try {
                    console.log('Fetching user from /auth/me...');
                    const response = await api.get('/auth/me');
                    console.log('Fetch user response:', response.data);

                    if (response.data.success && response.data.user) {
                        set({
                            user: {
                                id: response.data.user.id,
                                email: response.data.user.email,
                                name: response.data.user.name,
                                role: response.data.user.role || 'user',
                                carModel: response.data.user.carModel,
                                carYear: response.data.user.carYear,
                                licensePlate: response.data.user.licensePlate
                            },
                            isAuthenticated: true
                        });
                    } else {
                        // Если ответ неуспешный, не сбрасываем пользователя
                        console.log('Fetch user failed, keeping existing user');
                    }
                } catch (error: any) {
                    console.error('Fetch user error:', error.response?.status, error.response?.data);
                    // Не сбрасываем пользователя при ошибке, если он уже есть
                    const existingUser = get().user;
                    if (!existingUser) {
                        set({ user: null, isAuthenticated: false });
                    }
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