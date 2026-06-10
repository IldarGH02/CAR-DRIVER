import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 ДОБАВЬТЕ
import { Button } from '@shared/ui/button';
import { toast } from 'sonner';
import { authApi } from '../api/authApi';
import { useUserStore } from '@entities/user/model/userStore';

interface VerificationFormProps {
    email: string;
    onVerified: () => void;
    onBack: () => void;
}

export const VerificationForm = ({ email, onVerified, onBack }: VerificationFormProps) => {
    const navigate = useNavigate();
    const { setUser } = useUserStore();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
        startTimer();
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (error) {
            setError(null);
        }
    }, [code]);

    const startTimer = () => {
        setTimer(60);
        setCanResend(false);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleResendCode = async () => {
        setIsResending(true);
        setError(null);

        const result = await authApi.sendVerificationCode(email);

        if (result.success) {
            toast.success('Код отправлен повторно');
            setCode(['', '', '', '', '', '']);
            startTimer();

            if (result.previewUrl) {
                console.log('Preview URL:', result.previewUrl);
                toast.info(`Код отправлен: ${result.previewUrl}`, {
                    duration: 5000,
                });
            }
        } else {
            toast.error(result.message || 'Ошибка отправки кода');
        }

        setIsResending(false);
    };

    const handleCodeChange = (index: number, value: string) => {
        if (value.length > 1) return;
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            nextInput?.focus();
        }

        if (newCode.every(digit => digit !== '') && !isLoading) {
            handleVerify(newCode.join(''));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleVerify = async (verificationCode?: string) => {
        const finalCode = verificationCode || code.join('');

        if (finalCode.length !== 6) {
            setError('Введите 6-значный код');
            toast.error('Введите 6-значный код');
            return;
        }

        setIsLoading(true);
        setError(null);

        const result = await authApi.verifyCode(email, finalCode);

        if (result.success && result.token) {
            localStorage.setItem('token', result.token);
            if (result.user) {
                localStorage.setItem('user-storage', JSON.stringify(result.user));
                setUser(result.user);
            }

            toast.success('Код подтвержден! Выполняется вход...');

            navigate('/');
            onVerified();
        } else {
            const errorMessage = result.message || 'Неверный код подтверждения';
            setError(errorMessage);
            toast.error(errorMessage);
            setCode(['', '', '', '', '', '']);
            const firstInput = document.getElementById('code-0');
            firstInput?.focus();
        }

        setIsLoading(false);
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        const pastedCode = pastedText.replace(/\D/g, '').slice(0, 6);

        if (pastedCode.length === 6) {
            const newCode = pastedCode.split('');
            setCode(newCode);
            handleVerify(pastedCode);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <p className="text-sm text-muted-foreground">
                    Введите код подтверждения, отправленный на <strong>{email}</strong>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    Код действителен в течение 10 минут
                </p>
            </div>

            <div
                className="flex justify-center gap-2"
                onPaste={handlePaste}
            >
                {code.map((digit, index) => (
                    <input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={`w-12 h-12 text-center text-2xl font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors
                            ${error
                            ? 'border-red-500 focus:ring-red-500'
                            : digit
                                ? 'border-primary'
                                : 'border-gray-300'
                        }`}
                        disabled={isLoading}
                    />
                ))}
            </div>

            {error && (
                <div className="text-center">
                    <p className="text-sm text-red-500 animate-pulse">
                        {error}
                    </p>
                </div>
            )}

            <div className="text-center">
                <button
                    onClick={handleResendCode}
                    disabled={!canResend || isResending || isLoading}
                    className="text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isResending ? (
                        'Отправка...'
                    ) : canResend ? (
                        'Отправить код повторно'
                    ) : (
                        `Повторно через ${timer} сек`
                    )}
                </button>
            </div>

            <div className="flex gap-3">
                <Button
                    onClick={onBack}
                    variant="outline"
                    className="flex-1"
                    disabled={isLoading}
                >
                    Назад
                </Button>
                <Button
                    onClick={() => handleVerify()}
                    className="flex-1"
                    disabled={isLoading || code.some(digit => digit === '')}
                >
                    {isLoading ? 'Проверка...' : 'Подтвердить'}
                </Button>
            </div>
        </div>
    );
};