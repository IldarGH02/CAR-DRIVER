import { useState, useCallback } from 'react';
import { api } from '@shared/api/axiosInstance';
import { toast } from 'sonner';
import { User, Trip, NewUser, EditUser, NewTrip } from '../types';

export const useAdmin = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userTrips, setUserTrips] = useState<Trip[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data.users);
        } catch (error) {
            toast.error('Ошибка загрузки пользователей');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchUserTrips = useCallback(async (userId: number) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (dateFrom) params.append('dateFrom', dateFrom);
            if (dateTo) params.append('dateTo', dateTo);
            const response = await api.get(`/admin/users/${userId}/trips?${params.toString()}`);
            setUserTrips(response.data.trips);
        } catch (error) {
            toast.error('Ошибка загрузки поездок');
        } finally {
            setIsLoading(false);
        }
    }, [dateFrom, dateTo]);

    const addUser = async (newUser: NewUser) => {
        try {
            const response = await api.post('/admin/users', newUser);
            if (response.data.success) {
                toast.success('Пользователь добавлен');
                await fetchUsers();
                return true;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Ошибка добавления пользователя');
            return false;
        }
    };

    const updateUser = async (userId: number, editUser: EditUser) => {
        try {
            const response = await api.put(`/admin/users/${userId}`, editUser);
            if (response.data.success) {
                toast.success('Пользователь обновлён');
                await fetchUsers();
                return true;
            }
        } catch (error) {
            toast.error('Ошибка обновления пользователя');
            return false;
        }
    };

    const deleteUser = async (userId: number) => {
        if (confirm('Вы уверены, что хотите удалить этого пользователя? Все его поездки также будут удалены.')) {
            try {
                await api.delete(`/admin/users/${userId}`);
                toast.success('Пользователь удалён');
                await fetchUsers();
                return true;
            } catch (error) {
                toast.error('Ошибка удаления пользователя');
                return false;
            }
        }
        return false;
    };

    const addTrip = async (userId: number, newTrip: NewTrip) => {
        try {
            const response = await api.post(`/admin/users/${userId}/trips`, {
                date: newTrip.date,
                from: newTrip.from,
                to: newTrip.to,
                distance: parseFloat(newTrip.distance),
                fuelAmount: parseFloat(newTrip.fuelAmount) || 0,
                fuelCost: 0,
                amortization: parseFloat(newTrip.amortization) || 0,
                purpose: newTrip.purpose,
                expenseLine: newTrip.expenseLine,
                status: 'completed'
            });
            if (response.data.success) {
                toast.success('Поездка добавлена');
                await fetchUserTrips(userId);
                return true;
            }
        } catch (error) {
            toast.error('Ошибка добавления поездки');
            return false;
        }
    };

    const deleteTrip = async (userId: number, tripId: number) => {
        if (confirm('Вы уверены, что хотите удалить эту поездку?')) {
            try {
                await api.delete(`/admin/users/${userId}/trips/${tripId}`);
                toast.success('Поездка удалена');
                await fetchUserTrips(userId);
                return true;
            } catch (error) {
                toast.error('Ошибка удаления поездки');
                return false;
            }
        }
        return false;
    };

    return {
        users,
        selectedUser,
        userTrips,
        isLoading,
        dateFrom,
        dateTo,
        setSelectedUser,
        setDateFrom,
        setDateTo,
        fetchUsers,
        fetchUserTrips,
        addUser,
        updateUser,
        deleteUser,
        addTrip,
        deleteTrip,
    };
};