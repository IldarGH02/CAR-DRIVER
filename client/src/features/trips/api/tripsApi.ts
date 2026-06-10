import { api } from '@shared/api/axiosInstance.ts';
import type { Trip } from '../model/tripsStore.ts';

export const tripsApi = {
    getAll: async (): Promise<Trip[]> => {
        const response = await api.get('/trips');
        return response.data.trips;
    },
    create: async (trip: Omit<Trip, 'id' | 'userId'>): Promise<Trip> => {
        const response = await api.post('/trips', trip);
        return response.data.trip;
    },

    update: async (id: number, trip: Partial<Trip>): Promise<Trip> => {
        const response = await api.put(`/trips/${id}`, trip);
        return response.data.trip;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/trips/${id}`);
    },
};