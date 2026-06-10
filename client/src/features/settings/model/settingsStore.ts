import { create } from 'zustand';
import { api } from '@shared/api/axiosInstance';

interface Settings {
    user_id: number;
    currency: string;
    distance_unit: string;
    fuel_unit: string;
    amortization_rate: number;
    notifications: number;
    auto_save: number;
}

interface SettingsState {
    settings: Settings | null;
    isLoading: boolean;
    error: string | null;
    fetchSettings: () => Promise<void>;
    updateSettings: (data: Partial<Settings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
    settings: null,
    isLoading: false,
    error: null,

    fetchSettings: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/settings');
            console.log('fetchSettings response:', response.data);
            set({ settings: response.data.settings });
        } catch (error: any) {
            console.error('Fetch settings error:', error);
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    updateSettings: async (data) => {
        set({ isLoading: true, error: null });
        try {
            console.log('updateSettings sending:', data);
            const response = await api.put('/settings', data);
            console.log('updateSettings response:', response.data);

            if (response.data.success) {
                set({ settings: response.data.settings });
            }
        } catch (error: any) {
            console.error('Update settings error:', error);
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
}));