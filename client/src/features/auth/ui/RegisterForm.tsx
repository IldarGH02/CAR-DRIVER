import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@shared/lib/validation/registerSchema';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { VerificationForm } from '@features/auth/components';
import { api } from '@shared/api/axiosInstance';
import { toast } from 'sonner';
import { useAuthStore } from '../model/authStore';

export function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [tempEmail, setTempEmail] = useState('');
    const { register: registerUser, isLoading } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setTempEmail(data.email);

        try {
            const response = await api.post('/auth/send-code', { email: data.email });
            if (response.data.success) {
                setIsVerifying(true);
                toast.success('Код подтверждения отправлен на почту');
                if (response.data.previewUrl) {
                    console.log('Preview URL:', response.data.previewUrl);
                }
            } else {
                toast.error(response.data.message || 'Ошибка отправки кода');
            }
        } catch (error) {
            toast.error('Ошибка отправки кода');
        }
    };

    const handleVerified = async () => {
        const data = getValues();
        const success = await registerUser(data.email, data.password, data.name);
        if (success) {
            toast.success('Регистрация завершена!');
        }
    };

    const handleBack = () => {
        setIsVerifying(false);
    };

    if (isVerifying) {
        return (
            <VerificationForm
                email={tempEmail}
                onVerified={handleVerified}
                onBack={handleBack}
            />
        );
    }

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
                {isLoading ? 'Отправка кода...' : 'Зарегистрироваться'}
            </Button>
        </form>
    );
}