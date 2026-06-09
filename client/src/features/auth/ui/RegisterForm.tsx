import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { toast } from 'sonner';
import { authApi } from '../api/authApi.ts';
import { VerificationForm } from '../components';
import {useNavigate} from "react-router-dom";

const registerSchema = z.object({
    name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
    email: z.string().email('Введите корректный email'),
    password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
    onSuccess: (email: string) => void;
    onSwitchToLogin: () => void;
}

export const RegisterForm = ({ onSuccess, onSwitchToLogin }: RegisterFormProps) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showVerification, setShowVerification] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        try {
            const registerResult = await authApi.register(data.email, data.password, data.name);

            if (!registerResult.success) {
                toast.error(registerResult.message || 'Ошибка регистрации');
                return;
            }

            const codeResult = await authApi.sendVerificationCode(data.email);

            if (!codeResult.success) {
                toast.error(codeResult.message || 'Не удалось отправить код подтверждения');
                return;
            }

            // 3. Показываем форму верификации
            setRegisteredEmail(data.email);
            setShowVerification(true);

            toast.success('Код подтверждения отправлен на почту');

            // Если это ethereal.email, показываем ссылку для просмотра
            if (codeResult.previewUrl) {
                console.log('Preview URL:', codeResult.previewUrl);
                toast.info(`Письмо отправлено: ${codeResult.previewUrl}`, {
                    duration: 10000,
                });
            }

            onSuccess(data.email);
        } catch (error: any) {
            console.error('Registration error:', error);
            toast.error(error.response?.data?.message || 'Ошибка регистрации');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerificationSuccess = () => {
        console.log('🎉 Verification and login success!');
        toast.success('Добро пожаловать!');
        navigate('/')
    };

    if (showVerification) {
        return (
            <VerificationForm
                email={registeredEmail}
                onVerified={handleVerificationSuccess}
                onBack={() => setShowVerification(false)}
            />
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                    id="name"
                    placeholder="Введите ваше имя"
                    {...register('name')}
                    disabled={isLoading}
                />
                {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="example@mail.com"
                    {...register('email')}
                    disabled={isLoading}
                />
                {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="••••••"
                    {...register('password')}
                    disabled={isLoading}
                />
                {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••"
                    {...register('confirmPassword')}
                    disabled={isLoading}
                />
                {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
        </form>
    );
};