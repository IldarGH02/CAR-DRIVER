import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string()
        .email('Введите корректный email')
        .min(1, 'Email обязателен'),
    password: z.string()
        .min(6, 'Пароль должен содержать минимум 6 символов')
        .max(50, 'Пароль слишком длинный'),
    confirmPassword: z.string()
        .min(1, 'Подтвердите пароль'),
    name: z.string()
        .min(2, 'Имя должно содержать минимум 2 символа')
        .max(50, 'Имя слишком длинное'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;