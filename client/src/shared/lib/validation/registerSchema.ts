import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
    email: z.string().email('Введите корректный email'),
    password: z.string()
        .min(8, 'Пароль должен содержать минимум 8 символов')
        .regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
        .regex(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
        .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру')
        .regex(/[^A-Za-z0-9]/, 'Пароль должен содержать хотя бы один специальный символ (!@#$%^&* и т.д.)'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;