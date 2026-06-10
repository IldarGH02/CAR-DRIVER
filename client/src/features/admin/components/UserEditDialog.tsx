import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/dialog';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select';
import { Separator } from '@shared/ui/separator';
import { User, EditUser } from '../types';

interface UserEditDialogProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdateUser: (userId: number, user: EditUser) => Promise<boolean>;
}

export const UserEditDialog = ({ user, isOpen, onClose, onUpdateUser }: UserEditDialogProps) => {
    const [editUser, setEditUser] = useState<EditUser>({
        name: '',
        role: 'user',
        carModel: '',
        carYear: '',
        licensePlate: ''
    });

    useEffect(() => {
        if (user) {
            setEditUser({
                name: user.name,
                role: user.role,
                carModel: user.carModel || '',
                carYear: user.carYear || '',
                licensePlate: user.licensePlate || ''
            });
        }
    }, [user]);

    const handleSubmit = async () => {
        if (user) {
            const success = await onUpdateUser(user.id, editUser);
            if (success) {
                onClose();
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">Редактирование пользователя</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label className="text-sm sm:text-base">Имя</Label>
                        <Input
                            value={editUser.name}
                            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                            className="w-full text-base sm:text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm sm:text-base">Роль</Label>
                        <Select value={editUser.role} onValueChange={(v) => setEditUser({ ...editUser, role: v })}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">Пользователь</SelectItem>
                                <SelectItem value="admin">Администратор</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator className="my-4" />

                    <h4 className="font-medium text-sm sm:text-base">Информация об автомобиле</h4>

                    <div className="space-y-2">
                        <Label className="text-sm sm:text-base">Модель автомобиля</Label>
                        <Input
                            value={editUser.carModel}
                            onChange={(e) => setEditUser({ ...editUser, carModel: e.target.value })}
                            className="w-full text-base sm:text-sm"
                            placeholder="Например: Toyota Camry"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm sm:text-base">Год выпуска</Label>
                        <Input
                            value={editUser.carYear}
                            onChange={(e) => setEditUser({ ...editUser, carYear: e.target.value })}
                            className="w-full text-base sm:text-sm"
                            placeholder="Например: 2020"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm sm:text-base">Гос. номер</Label>
                        <Input
                            value={editUser.licensePlate}
                            onChange={(e) => setEditUser({ ...editUser, licensePlate: e.target.value })}
                            className="w-full text-base sm:text-sm"
                            placeholder="Например: А123БВ 777"
                        />
                    </div>

                    <Button onClick={handleSubmit} className="w-full text-sm sm:text-base py-2 sm:py-2.5">
                        Сохранить
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};