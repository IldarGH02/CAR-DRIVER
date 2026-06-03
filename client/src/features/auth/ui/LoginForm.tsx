import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@shared/lib/validation/loginSchema";
import { useAuthStore } from "@features/auth/model/authStore";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { toast } from "sonner";

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, error, clearError } = useAuthStore();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        clearError();
        const success = await login(data.email, data.password);

        if (success) {
            toast.success('Вход выполнен успешно!');
            navigate('/');
        } else {
            toast.error(error || 'Ошибка входа');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                    id="email"
                    type="email"
                    placeholder="example@mail.com"
                    error={errors.email?.message}
                    {...register("email")}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Пароль</label>
                <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••"
                    error={errors.password?.message}
                    {...register("password")}
                />
            </div>

            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        onChange={(e) => setShowPassword(e.target.checked)}
                    />
                    Показать пароль
                </label>
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Вход..." : "Войти"}
            </Button>
        </form>
    );
}