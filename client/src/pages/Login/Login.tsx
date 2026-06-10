import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@shared/ui/card";
import { LoginForm } from "@features/auth/ui/LoginForm";
import { RegisterForm } from "@features/auth/ui/RegisterForm";
import { useUserStore } from "@entities/user/model/userStore";

export function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const { isAuthenticated } = useUserStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="h-screen flex items-center justify-center bg-background">
            <div className="w-full max-w-md p-8">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">
                            {isLogin ? "Вход в систему" : "Регистрация"}
                        </CardTitle>
                        <CardDescription>
                            {isLogin
                                ? "Войдите, чтобы получить доступ ко всем функциям"
                                : "Создайте аккаунт для учёта расходов"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLogin ? (
                            <LoginForm />
                        ) : (
                            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
                        )}

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-sm text-primary hover:underline"
                            >
                                {isLogin
                                    ? "Нет аккаунта? Зарегистрироваться"
                                    : "Уже есть аккаунт? Войти"}
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}