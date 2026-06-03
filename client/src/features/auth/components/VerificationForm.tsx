import { useState } from 'react';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { toast } from 'sonner';
import { api } from '@shared/api/axiosInstance';

interface VerificationFormProps {
    email: string;
    onVerified: () => void;
    onBack: () => void;
}

export const VerificationForm = ({ email, onVerified, onBack }: VerificationFormProps) => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const startTimer = () => {
        setTimer(60);
        setCanResend(false);
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleResendCode = async () => {
        setIsResending(true);
        try {
            const response = await api.post('/auth/send-code', { email });
            if (response.data.success) {
                toast.success('Код отправлен повторно');
                startTimer();
                if (response.data.previewUrl) {
                    console.log('Preview URL:', response.data.previewUrl);
                }
            } else {
                toast.error(response.data.message || 'Ошибка отправки кода');
            }
        } catch (error) {
            toast.error('Ошибка отправки кода');
        } finally {
            setIsResending(false);
        }
    };

    const handleCodeChange = (index: number, value: string) => {
        if (value.length > 1) return;
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Автоматически переключаемся на следующий input
        if (value && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleVerify = async () => {
        const verificationCode = code.join('');
        if (verificationCode.length !== 6) {
            toast.error('Введите 6-значный код');
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post('/auth/verify-code', { email, code: verificationCode });
            if (response.data.success) {
                toast.success('Код подтвержден');
                onVerified();
            } else {
                toast.error(response.data.message || 'Неверный код');
            }
        } catch (error) {
            toast.error('Ошибка проверки кода');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <p className="text-sm text-muted-foreground">
                    Введите код подтверждения, отправленный на {email}
                </p>
            </div>

            <div className="flex justify-center gap-2">
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
                        className="w-12 h-12 text-center text-2xl font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                ))}
            </div>

            <div className="text-center">
                <button
                    onClick={handleResendCode}
                    disabled={!canResend || isResending}
                    className="text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isResending ? 'Отправка...' : canResend ? 'Отправить код повторно' : `Повторно через ${timer} сек`}
                </button>
            </div>

            <div className="flex gap-3">
                <Button onClick={onBack} variant="outline" className="flex-1">
                    Назад
                </Button>
                <Button onClick={handleVerify} className="flex-1" disabled={isLoading}>
                    {isLoading ? 'Проверка...' : 'Подтвердить'}
                </Button>
            </div>
        </div>
    );
};