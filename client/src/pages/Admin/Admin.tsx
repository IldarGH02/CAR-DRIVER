import { useState, useEffect } from 'react';
import { useUserStoreData } from '@entities/user/model/userStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog';
import { Badge } from '@shared/ui/badge';
import { Separator } from '@shared/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select';
import { UserPlus, Trash2, Edit, Eye, Users, Car, FileText, Shield } from 'lucide-react';
import { api } from '@shared/api/axiosInstance';
import { toast } from 'sonner';

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

export function Admin() {
    const { user: currentUser } = useUserStoreData();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userTrips, setUserTrips] = useState<Trip[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [isEditUserOpen, setIsEditUserOpen] = useState(false);
    const [isViewTripsOpen, setIsViewTripsOpen] = useState(false);
    const [newUser, setNewUser] = useState({ email: '', password: '', name: '', role: 'user' });
    const [editUser, setEditUser] = useState({ name: '', role: '', carModel: '', carYear: '', licensePlate: '' });

    useEffect(() => {
        if (currentUser?.role === 'admin') {
            fetchUsers();
        }
    }, [currentUser]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data.users);
        } catch (error) {
            toast.error('Ошибка загрузки пользователей');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserTrips = async (userId: number) => {
        try {
            const response = await api.get(`/admin/users/${userId}/trips`);
            setUserTrips(response.data.trips);
        } catch (error) {
            toast.error('Ошибка загрузки поездок');
        }
    };

    const handleAddUser = async () => {
        if (!newUser.email || !newUser.password || !newUser.name) {
            toast.error('Заполните все поля');
            return;
        }
        try {
            const response = await api.post('/admin/users', newUser);
            if (response.data.success) {
                toast.success('Пользователь добавлен');
                setIsAddUserOpen(false);
                setNewUser({ email: '', password: '', name: '', role: 'user' });
                fetchUsers();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Ошибка добавления пользователя');
        }
    };

    const handleUpdateUser = async (userId: number) => {
        try {
            const response = await api.put(`/admin/users/${userId}`, editUser);
            if (response.data.success) {
                toast.success('Пользователь обновлён');
                setIsEditUserOpen(false);
                fetchUsers();
            }
        } catch (error) {
            toast.error('Ошибка обновления пользователя');
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            try {
                await api.delete(`/admin/users/${userId}`);
                toast.success('Пользователь удалён');
                fetchUsers();
            } catch (error) {
                toast.error('Ошибка удаления пользователя');
            }
        }
    };

    const openUserTrips = async (user: User) => {
        setSelectedUser(user);
        await fetchUserTrips(user.id);
        setIsViewTripsOpen(true);
    };

    const openEditUser = (user: User) => {
        setEditUser({
            name: user.name,
            role: user.role,
            carModel: user.carModel || '',
            carYear: user.carYear || '',
            licensePlate: user.licensePlate || '',
        });
        setSelectedUser(user);
        setIsEditUserOpen(true);
    };

    // Проверка прав администратора
    if (currentUser?.role !== 'admin') {
        return (
            <div className="flex-1 flex items-center justify-center bg-background">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Доступ запрещён</CardTitle>
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
            <div className="p-8">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-semibold mb-2">Админ-панель</h2>
                        <p className="text-muted-foreground">Управление пользователями и поездками</p>
                    </div>
                    <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <UserPlus className="w-4 h-4" />
                                Добавить пользователя
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Добавление пользователя</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Имя</Label>
                                    <Input value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Пароль</Label>
                                    <Input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Роль</Label>
                                    <Select value={newUser.role} onValueChange={(v) => setNewUser({ ...newUser, role: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user">Пользователь</SelectItem>
                                            <SelectItem value="admin">Администратор</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={handleAddUser} className="w-full">Создать</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Пользователи
                        </CardTitle>
                        <CardDescription>Все зарегистрированные пользователи системы</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-8">Загрузка...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Имя</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Роль</TableHead>
                                            <TableHead>Автомобиль</TableHead>
                                            <TableHead>Госномер</TableHead>
                                            <TableHead className="text-right">Действия</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>{user.id}</TableCell>
                                                <TableCell>{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <Badge className={user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                                                        {user.role === 'admin' ? 'Админ' : 'Пользователь'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{user.carModel || '—'}</TableCell>
                                                <TableCell>{user.licensePlate || '—'}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => openUserTrips(user)} title="Поездки">
                                                            <Car className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => openEditUser(user)} title="Редактировать">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        {user.role !== 'admin' && (
                                                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteUser(user.id)} title="Удалить">
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Диалог просмотра поездок */}
                <Dialog open={isViewTripsOpen} onOpenChange={setIsViewTripsOpen}>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Поездки пользователя: {selectedUser?.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            {userTrips.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">Нет поездок</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Дата</TableHead>
                                                <TableHead>Маршрут</TableHead>
                                                <TableHead>Цель</TableHead>
                                                <TableHead>Пробег</TableHead>
                                                <TableHead>Топливо (л)</TableHead>
                                                <TableHead>Амортизация</TableHead>
                                                <TableHead>Строка расходов</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {userTrips.map((trip) => (
                                                <TableRow key={trip.id}>
                                                    <TableCell>{new Date(trip.date).toLocaleDateString('ru-RU')}</TableCell>
                                                    <TableCell>{trip.from} → {trip.to}</TableCell>
                                                    <TableCell>{trip.purpose}</TableCell>
                                                    <TableCell>{trip.distance} км</TableCell>
                                                    <TableCell>{(trip.fuelAmount || 0).toFixed(1)} л</TableCell>
                                                    <TableCell>{trip.amortization} ₽</TableCell>
                                                    <TableCell>{trip.expenseLine || '—'}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Диалог редактирования пользователя */}
                <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Редактирование пользователя</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Имя</Label>
                                <Input value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Роль</Label>
                                <Select value={editUser.role} onValueChange={(v) => setEditUser({ ...editUser, role: v })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">Пользователь</SelectItem>
                                        <SelectItem value="admin">Администратор</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Separator />
                            <h4 className="font-medium">Информация об автомобиле</h4>
                            <div className="space-y-2">
                                <Label>Модель автомобиля</Label>
                                <Input value={editUser.carModel} onChange={(e) => setEditUser({ ...editUser, carModel: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Год выпуска</Label>
                                <Input value={editUser.carYear} onChange={(e) => setEditUser({ ...editUser, carYear: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Гос. номер</Label>
                                <Input value={editUser.licensePlate} onChange={(e) => setEditUser({ ...editUser, licensePlate: e.target.value })} />
                            </div>
                            <Button onClick={() => selectedUser && handleUpdateUser(selectedUser.id)} className="w-full">Сохранить</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}