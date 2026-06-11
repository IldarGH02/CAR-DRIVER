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
                    <TableHead className="whitespace-nowrap">ID</TableHead>
                    <TableHead className="whitespace-nowrap">Имя</TableHead>
                    <TableHead className="whitespace-nowrap">Email</TableHead>
                    <TableHead className="whitespace-nowrap">Роль</TableHead>
                    <TableHead className="whitespace-nowrap hidden md:table-cell">Автомобиль</TableHead>
                    <TableHead className="whitespace-nowrap hidden lg:table-cell">Госномер</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Действия</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell className="whitespace-nowrap">{user.id}</TableCell>
                        <TableCell className="whitespace-nowrap">{user.name}</TableCell>
                        <TableCell className="whitespace-nowrap">{user.email}</TableCell>
                        <TableCell className="whitespace-nowrap">
                            <Badge className={user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'}>
                                {user.role === 'admin' ? 'Админ' : 'Пользователь'}
                            </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{user.carModel ? user.carModel : '—'}</TableCell>
                        <TableCell className="hidden lg:table-cell">{user.licensePlate ? user.licensePlate : '—'}</TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                            <div className="flex justify-end gap-1 sm:gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => onViewTrips(user)} title="Поездки">
                                    <Car className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => onGenerateReport(user)} title="Отчёт">
                                    <FileText className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => onEditUser(user)} title="Редактировать">
                                    <Edit className="w-4 h-4" />
                                </Button>
                                {user.role !== 'admin' && (
                                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 text-destructive" onClick={() => onDeleteUser(user.id)} title="Удалить">
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