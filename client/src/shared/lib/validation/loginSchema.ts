import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string()
        .email('Введите корректный email')
        .min(1, 'Email обязателен'),
    password: z.string()
        .min(6, 'Пароль должен содержать минимум 6 символов')
        .max(50, 'Пароль слишком длинный'),
});

export type LoginFormData = z.infer<typeof loginSchema>;