import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Car, FileText, Edit, Trash2 } from 'lucide-react';
import { User } from '../types';

interface UsersTableProps {
    users: User[];
    onViewTrips: (user: User) => void;
    onEditUser: (user: User) => void;
    onDeleteUser: (userId: number) => void;
    onGenerateReport: (user: User) => void;
}

export const UsersTable = ({ users, onViewTrips, onEditUser, onDeleteUser, onGenerateReport }: UsersTableProps) => (
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
                                <Button variant="ghost" size="icon" onClick={() => onViewTrips(user)} title="Поездки">
                                    <Car className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => onGenerateReport(user)} title="Отчёт">
                                    <FileText className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => onEditUser(user)} title="Редактировать">
                                    <Edit className="w-4 h-4" />
                                </Button>
                                {user.role !== 'admin' && (
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDeleteUser(user.id)} title="Удалить">
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
);