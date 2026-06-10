import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select';
import { UserPlus } from 'lucide-react';
import { NewUser } from '../types';

interface UserAddDialogProps {
    onAddUser: (user: NewUser) => Promise<boolean>;
}

const initialUser: NewUser = { email: '', password: '', name: '', role: 'user' };

export const UserAddDialog = ({ onAddUser }: UserAddDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [newUser, setNewUser] = useState(initialUser);

    const handleSubmit = async () => {
        if (!newUser.email || !newUser.password || !newUser.name) {
            return;
        }
        const success = await onAddUser(newUser);
        if (success) {
            setIsOpen(false);
            setNewUser(initialUser);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 w-full sm:w-auto">
                    <UserPlus className="w-4 h-4" />
                    Добавить пользователя
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">Добавление пользователя</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label className="text-sm sm:text-base">Имя</Label>
                        <Input
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            className="w-full text-base sm:text-sm"
                            placeholder="Иван Иванов"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm sm:text-base">Email</Label>
                        <Input
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            className="w-full text-base sm:text-sm"
                            placeholder="user@example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm sm:text-base">Пароль</Label>
                        <Input
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            className="w-full text-base sm:text-sm"
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm sm:text-base">Роль</Label>
                        <Select value={newUser.role} onValueChange={(v) => setNewUser({ ...newUser, role: v })}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">Пользователь</SelectItem>
                                <SelectItem value="admin">Администратор</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleSubmit} className="w-full text-sm sm:text-base py-2 sm:py-2.5">
                        Создать
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};