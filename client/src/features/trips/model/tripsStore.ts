import { create, StateCreator } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { tripsApi } from '../api/tripsApi';
import { toast } from 'sonner';

export interface Trip {
    id: number;
    date: string;
    from: string;
    to: string;
    distance: number;
    fuelAmount: number;
    fuelCost: number;
    amortization: number;
    purpose: string;
    expenseLine?: string;
    status: 'completed' | 'planned' | 'cancelled';
    userId: number;
}

interface IInitialStateTrips {
    trips: Trip[];
    isLoading: boolean;
    error: string | null;
}

interface IActionTrips {
    fetchTrips: () => Promise<void>;
    addTrip: (trip: Omit<Trip, 'id' | 'userId'>) => Promise<boolean>;
    deleteTrip: (id: number) => Promise<void>; // Изменено с Promise<boolean> на Promise<void>
    clearError: () => void;
}

type ITripsState = IInitialStateTrips & IActionTrips;

const initialState: IInitialStateTrips = {
    trips: [],
    isLoading: false,
    error: null,
};

const tripsStore: StateCreator<ITripsState> = (set, get) => ({
    ...initialState,

    fetchTrips: async () => {
        set({ isLoading: true, error: null });
        try {
            const trips = await tripsApi.getAll();
            set({ trips });
        } catch (error: any) {
            set({ error: error.message || 'Ошибка загрузки поездок' });
            toast.error('Ошибка загрузки поездок');
        } finally {
            set({ isLoading: false });
        }
    },

    addTrip: async (trip) => {
        set({ isLoading: true, error: null });
        try {
            const newTrip = await tripsApi.create(trip);
            set({ trips: [newTrip, ...get().trips] });
            toast.success('Поездка добавлена успешно');
            return true;
        } catch (error: any) {
            set({ error: error.message || 'Не удалось добавить поездку' });
            toast.error(error.message || 'Не удалось добавить поездку');
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteTrip: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await tripsApi.delete(id);
            set({ trips: get().trips.filter(t => t.id !== id) });
            toast.success('Поездка удалена');
        } catch (error: any) {
            set({ error: error.message || 'Не удалось удалить поездку' });
            toast.error(error.message || 'Не удалось удалить поездку');
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    clearError: () => set({ error: null }),
});

const useTripsStore = create<ITripsState>()(
    devtools(
        persist(tripsStore, {
            name: 'trips-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ trips: state.trips }),
        })
    )
);

export { useTripsStore };

export const useTripsStoreData = () => ({
    trips: useTripsStore((state) => state.trips),
    isLoading: useTripsStore((state) => state.isLoading),
    error: useTripsStore((state) => state.error),
    fetchTrips: useTripsStore.getState().fetchTrips,
    addTrip: useTripsStore.getState().addTrip,
    deleteTrip: useTripsStore.getState().deleteTrip,
    clearError: useTripsStore.getState().clearError,
});