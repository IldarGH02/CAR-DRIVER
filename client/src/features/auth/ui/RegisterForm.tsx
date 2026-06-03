import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@shared/lib/validation/registerSchema';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { toast } from 'sonner';
import { useAuthStore } from '../model/authStore';

export function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const { register: registerUser, isLoading } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    // Регистрация сразу, без верификации
    const onSubmit = async (data: RegisterFormData) => {
        // Вызываем регистрацию напрямую
        const success = await registerUser(data.email, data.password, data.name);

        if (success) {
            toast.success('Регистрация успешно завершена!');
            // useAuthStore уже должен перенаправлять на Dashboard
        } else {
            toast.error('Ошибка регистрации');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label>Имя</Label>
                <Input
                    placeholder="Иван Иванов"
                    error={errors.name?.message}
                    {...register('name')}
                />
            </div>

            <div className="space-y-2">
                <Label>Email</Label>
                <Input
                    type="email"
                    placeholder="example@mail.com"
                    error={errors.email?.message}
                    {...register('email')}
                />
            </div>

            <div className="space-y-2">
                <Label>Пароль</Label>
                <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••"
                    error={errors.password?.message}
                    {...register('password')}
                />
            </div>

            <div className="space-y-2">
                <Label>Подтвердите пароль</Label>
                <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••"
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                />
            </div>

            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        onChange={(e) => setShowPassword(e.target.checked)}
                    />
                    Показать пароли
                </label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
        </form>
    );
}