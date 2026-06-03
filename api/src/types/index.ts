import 'fastify';
import '@fastify/jwt';

declare module 'fastify' {
    interface FastifyRequest {
        user: {
            id: number;
            email: string;
        };
    }
}

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: {
            id: number;
            email: string;
        };
        user: {
            id: number;
            email: string;
        };
    }
}

// ... остальные типы
export interface User {
    id: number;
    email: string;
    name: string;
    carModel?: string;
    carYear?: string;
    licensePlate?: string;
    createdAt: string;
}

export interface Trip {
    id: number;
    userId: number;
    date: string;
    from: string;
    to: string;
    distance: number;
    fuelAmount: number;
    fuelCost: number;
    amortization: number;
    purpose: string;
    status: 'completed' | 'planned' | 'cancelled';
    createdAt: string;
}

export interface Settings {
    userId: number;
    currency: string;
    distanceUnit: string;
    fuelUnit: string;
    amortizationRate: number;
    notifications: boolean;
    autoSave: boolean;
}

export interface TripStats {
    totalTrips: number;
    totalDistance: number;
    totalFuelCost: number;
    totalAmortization: number;
    totalExpenses: number;
    averageFuelConsumption: number;
}

export interface AuthResponse {
    success: boolean;
    token?: string;
    user?: Omit<User, 'createdAt'>;
    message?: string;
}

export interface CreateTripInput {
    date: string;
    from: string;
    to: string;
    distance: number;
    fuelAmount: number;
    fuelCost: number;
    amortization: number;
    purpose: string;
    status?: 'completed' | 'planned' | 'cancelled';
}