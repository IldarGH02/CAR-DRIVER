import { useState, useEffect } from 'react';
import { useUserStoreData } from '@entities/user/model/userStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@shared/ui/card';
import { Users } from 'lucide-react';
import { api } from '@shared/api/axiosInstance';
import { toast } from 'sonner';

import { AdminHeader } from '@features/admin/components';
import { StatisticsCards } from '@features/admin/components/StatisticsCards';
import { UsersTable } from '@features/admin/components/UsersTable';
import { UserAddDialog } from '@features/admin/components/UserAddDialog';
import { UserEditDialog } from '@features/admin/components/UserEditDialog';
import { UserTripsDialog } from '@features/admin/components/UserTripsDialog';

interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    carModel?: string;
    carYear?: string;
    licensePlate?: string;
}

interface Trip {
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
}

interface NewUser {
    email: string;
    password: string;
    name: string;
    role: string;
}

interface EditUser {
    name: string;
    role: string;
    carModel: string;
    carYear: string;
    licensePlate: string;
}

export function Admin() {
    const { user: currentUser } = useUserStoreData();
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState({ totalUsers: 0, totalAdmins: 0, totalRegularUsers: 0 });
    const [isLoading, setIsLoading] = useState(false);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userTrips, setUserTrips] = useState<Trip[]>([]);
    const [isTripsDialogOpen, setIsTripsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [tripsDateFrom, setTripsDateFrom] = useState('');
    const [tripsDateTo, setTripsDateTo] = useState('');
    const [isTripsLoading, setIsTripsLoading] = useState(false);

    useEffect(() => {
        if (currentUser?.role === 'admin') {
            fetchUsers();
        }
    }, [currentUser]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/admin/users');
            if (response.data.success) {
                setUsers(response.data.users);
                const admins = response.data.users.filter((u: User) => u.role === 'admin').length;
                const regularUsers = response.data.users.filter((u: User) => u.role !== 'admin').length;
                setStats({
                    totalUsers: response.data.users.length,
                    totalAdmins: admins,
                    totalRegularUsers: regularUsers
                });
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error('Ошибка загрузки пользователей');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserTrips = async (userId: number) => {
        setIsTripsLoading(true);
        try {
            const params: any = {};
            if (tripsDateFrom) params.dateFrom = tripsDateFrom;
            if (tripsDateTo) params.dateTo = tripsDateTo;

            const response = await api.get(`/admin/users/${userId}/trips`, { params });
            if (response.data.success) {
                setUserTrips(response.data.trips);
            }
        } catch (error) {
            console.error('Failed to fetch user trips:', error);
            toast.error('Ошибка загрузки поездок');
        } finally {
            setIsTripsLoading(false);
        }
    };

    const handleViewTrips = (user: User) => {
        setSelectedUser(user);
        setTripsDateFrom('');
        setTripsDateTo('');
        setIsTripsDialogOpen(true);
        fetchUserTrips(user.id);
    };

    const handleAddUser = async (newUser: NewUser) => {
        try {
            const response = await api.post('/admin/users', newUser);
            if (response.data.success) {
                toast.success('Пользователь добавлен');
                await fetchUsers();
                return true;
            }
            return false;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Ошибка добавления пользователя');
            return false;
        }
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setIsEditDialogOpen(true);
    };

    const handleUpdateUser = async (userId: number, updatedUser: EditUser) => {
        try {
            const response = await api.put(`/admin/users/${userId}`, updatedUser);
            if (response.data.success) {
                toast.success('Пользователь обновлён');
                await fetchUsers();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to update user:', error);
            toast.error('Ошибка обновления пользователя');
            return false;
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (!confirm('Вы уверены, что хотите удалить этого пользователя? Все его поездки также будут удалены.')) {
            return;
        }
        try {
            const response = await api.delete(`/admin/users/${userId}`);
            if (response.data.success) {
                toast.success('Пользователь удалён');
                await fetchUsers();
            }
        } catch (error) {
            console.error('Failed to delete user:', error);
            toast.error('Ошибка удаления пользователя');
        }
    };

    const handleAddTrip = async (userId: number, trip: any) => {
        try {
            const response = await api.post(`/admin/users/${userId}/trips`, trip);
            if (response.data.success) {
                toast.success('Поездка добавлена');
                await fetchUserTrips(userId);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to add trip:', error);
            toast.error('Ошибка добавления поездки');
            return false;
        }
    };

    const handleDeleteTrip = async (userId: number, tripId: number) => {
        try {
            const response = await api.delete(`/admin/users/${userId}/trips/${tripId}`);
            if (response.data.success) {
                toast.success('Поездка удалена');
                await fetchUserTrips(userId);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to delete trip:', error);
            toast.error('Ошибка удаления поездки');
            return false;
        }
    };

    const handleApplyFilter = () => {
        if (selectedUser) {
            fetchUserTrips(selectedUser.id);
        }
    };

    const handleGenerateReport = async (user: User) => {
        try {
            const response = await api.get(`/admin/users/${user.id}/report`);
            if (response.data.success) {
                const blob = new Blob([JSON.stringify(response.data.report, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `report_${user.name}_${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success('Отчёт сгенерирован');
            }
        } catch (error) {
            console.error('Failed to generate report:', error);
            toast.error('Ошибка генерации отчёта');
        }
    };

    if (currentUser?.role !== 'admin') {
        return (
            <div className="flex-1 flex items-center justify-center bg-background p-4">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle className="text-xl sm:text-2xl">Доступ запрещён</CardTitle>
                        <CardDescription>
                            У вас нет прав администратора для доступа к этой странице.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-auto bg-background">
            <div className="p-3 sm:p-4 md:p-6 lg:p-8">
                <AdminHeader
                    title="Управление пользователями"
                    description="Просмотр, добавление и управление пользователями системы"
                />

                <StatisticsCards
                    totalUsers={stats.totalUsers}
                    totalAdmins={stats.totalAdmins}
                    totalRegularUsers={stats.totalRegularUsers}
                />

                <div className="flex justify-end mb-4 sm:mb-6">
                    <UserAddDialog onAddUser={handleAddUser} />
                </div>

                <Card>
                    <CardHeader className="p-4 sm:p-6">
                        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                            <Users className="w-5 h-5" />
                            Пользователи
                        </CardTitle>
                        <CardDescription className="text-sm">
                            Все зарегистрированные пользователи системы
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                        {isLoading ? (
                            <div className="text-center py-8">Загрузка...</div>
                        ) : users.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                Нет пользователей
                            </div>
                        ) : (
                            <UsersTable
                                users={users}
                                onViewTrips={handleViewTrips}
                                onEditUser={handleEditUser}
                                onDeleteUser={handleDeleteUser}
                                onGenerateReport={handleGenerateReport}
                            />
                        )}
                    </CardContent>
                </Card>

                <UserEditDialog
                    user={selectedUser}
                    isOpen={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    onUpdateUser={handleUpdateUser}
                />

                <UserTripsDialog
                    user={selectedUser}
                    trips={userTrips}
                    isOpen={isTripsDialogOpen}
                    isLoading={isTripsLoading}
                    dateFrom={tripsDateFrom}
                    dateTo={tripsDateTo}
                    onClose={() => setIsTripsDialogOpen(false)}
                    onDateFromChange={setTripsDateFrom}
                    onDateToChange={setTripsDateTo}
                    onApplyFilter={handleApplyFilter}
                    onAddTrip={handleAddTrip}
                    onDeleteTrip={handleDeleteTrip}
                />
            </div>
        </div>
    );
}