import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2)
});

export const tripSchema = z.object({
    date: z.string(),
    from: z.string(),
    to: z.string(),
    distance: z.number().positive(),
    fuelAmount: z.number().nonnegative(),
    fuelCost: z.number().nonnegative(),
    amortization: z.number().nonnegative(),
    purpose: z.string(),
    status: z.enum(['completed', 'planned', 'cancelled']).optional()
});

export const settingsSchema = z.object({
    currency: z.string().optional(),
    distance_unit: z.string().optional(),
    fuel_unit: z.string().optional(),
    amortization_rate: z.number().optional(),
    notifications: z.boolean().optional(),
    auto_save: z.boolean().optional()
});