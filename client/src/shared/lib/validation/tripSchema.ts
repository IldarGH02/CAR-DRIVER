import { z } from 'zod';

export const tripSchema = z.object({
    date: z.string()
        .min(1, 'Дата обязательна'),
    from: z.string()
        .min(2, 'Укажите пункт отправления'),
    to: z.string()
        .min(2, 'Укажите пункт назначения'),
    distance: z.number()
        .positive('Пробег должен быть положительным')
        .max(10000, 'Слишком большой пробег'),
    fuelAmount: z.number()
        .nonnegative('Количество топлива не может быть отрицательным')
        .max(1000, 'Слишком много топлива'),
    fuelCost: z.number()
        .nonnegative('Стоимость топлива не может быть отрицательной'),
    purpose: z.string()
        .min(1, 'Укажите цель поездки'),
});

export type TripFormData = z.infer<typeof tripSchema>;