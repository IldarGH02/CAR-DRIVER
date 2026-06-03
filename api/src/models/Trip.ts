import { get, all, run } from '../config/database';

export interface Trip {
    id: number;
    user_id: number;
    date: string;
    from_city: string;
    to_city: string;
    distance: number;
    fuel_amount: number;
    fuel_cost: number;
    amortization: number;
    purpose: string;
    expense_line?: string;
    avg_consumption?: number;
    status: string;
    created_at: string;
}

export interface TripWithFromTo {
    id: number;
    date: string;
    from: string;
    to: string;
    distance: number;
    fuelAmount: number;
    fuelCost: number;
    amortization: number;
    purpose: string;
    expenseLine?: string;
    avgConsumption?: number;
    status: string;
    createdAt: string;
}

export interface TripStats {
    totalTrips: number;
    totalDistance: number;
    totalFuelCost: number;
    totalAmortization: number;
    totalExpenses: number;
    averageFuelConsumption: number;
}

export interface CreateTripInput {
    userId: number;
    date: string;
    from: string;
    to: string;
    distance: number;
    fuelAmount: number;
    fuelCost: number;
    amortization: number;
    purpose: string;
    expenseLine?: string;
    avgConsumption?: number;
    status?: string;
}

export const TripModel = {
    findAllByUserId: async (userId: number): Promise<TripWithFromTo[]> => {
        const trips = await all(
            `SELECT id, date, from_city, to_city, distance,
                 fuel_amount, fuel_cost, amortization, purpose, expense_line, avg_consumption, status,
                 created_at
             FROM trips WHERE user_id = ? ORDER BY date DESC`,
            [userId]
        );

        return trips.map((trip: any) => ({
            id: trip.id,
            date: trip.date,
            from: trip.from_city,
            to: trip.to_city,
            distance: trip.distance,
            fuelAmount: trip.fuel_amount,
            fuelCost: trip.fuel_cost,
            amortization: trip.amortization,
            purpose: trip.purpose,
            expenseLine: trip.expense_line,
            avgConsumption: trip.avg_consumption,
            status: trip.status,
            createdAt: trip.created_at
        }));
    },

    findById: async (id: number, userId: number): Promise<Trip | undefined> => {
        return await get('SELECT * FROM trips WHERE id = ? AND user_id = ?', [id, userId]);
    },

    create: async (data: CreateTripInput): Promise<TripWithFromTo> => {
        const result = await run(
            `INSERT INTO trips (user_id, date, from_city, to_city, distance, fuel_amount, fuel_cost, amortization, purpose, expense_line, avg_consumption, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.userId,
                data.date,
                data.from,
                data.to,
                data.distance,
                data.fuelAmount,
                data.fuelCost,
                data.amortization,
                data.purpose,
                data.expenseLine || null,
                data.avgConsumption || null,
                data.status || 'completed'
            ]
        );

        return {
            id: result.lastID,
            date: data.date,
            from: data.from,
            to: data.to,
            distance: data.distance,
            fuelAmount: data.fuelAmount,
            fuelCost: data.fuelCost,
            amortization: data.amortization,
            purpose: data.purpose,
            expenseLine: data.expenseLine,
            avgConsumption: data.avgConsumption,
            status: data.status || 'completed',
            createdAt: new Date().toISOString()
        };
    },

    update: async (id: number, userId: number, data: Partial<CreateTripInput>): Promise<void> => {
        const fields: string[] = [];
        const values: any[] = [];

        if (data.date !== undefined) {
            fields.push('date = ?');
            values.push(data.date);
        }
        if (data.from !== undefined) {
            fields.push('from_city = ?');
            values.push(data.from);
        }
        if (data.to !== undefined) {
            fields.push('to_city = ?');
            values.push(data.to);
        }
        if (data.distance !== undefined) {
            fields.push('distance = ?');
            values.push(data.distance);
        }
        if (data.fuelAmount !== undefined) {
            fields.push('fuel_amount = ?');
            values.push(data.fuelAmount);
        }
        if (data.fuelCost !== undefined) {
            fields.push('fuel_cost = ?');
            values.push(data.fuelCost);
        }
        if (data.amortization !== undefined) {
            fields.push('amortization = ?');
            values.push(data.amortization);
        }
        if (data.purpose !== undefined) {
            fields.push('purpose = ?');
            values.push(data.purpose);
        }
        if (data.expenseLine !== undefined) {
            fields.push('expense_line = ?');
            values.push(data.expenseLine);
        }
        if (data.avgConsumption !== undefined) {
            fields.push('avg_consumption = ?');
            values.push(data.avgConsumption);
        }
        if (data.status !== undefined) {
            fields.push('status = ?');
            values.push(data.status);
        }

        if (fields.length === 0) return;

        values.push(id, userId);
        const query = `UPDATE trips SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
        await run(query, values);
    },

    delete: async (id: number, userId: number): Promise<void> => {
        await run('DELETE FROM trips WHERE id = ? AND user_id = ?', [id, userId]);
    },

    getStats: async (userId: number, dateFrom?: string, dateTo?: string): Promise<TripStats> => {
        let query = `
            SELECT
                COUNT(*) as totalTrips,
                SUM(distance) as totalDistance,
                SUM(fuel_cost) as totalFuelCost,
                SUM(amortization) as totalAmortization,
                AVG(avg_consumption) as avgFuelConsumption
            FROM trips WHERE user_id = ?
        `;

        const params: any[] = [userId];

        if (dateFrom) {
            query += ` AND date >= ?`;
            params.push(dateFrom);
        }
        if (dateTo) {
            query += ` AND date <= ?`;
            params.push(dateTo);
        }

        const result = await get(query, params);

        const avgFuelConsumption = result?.avgFuelConsumption ? parseFloat(Number(result.avgFuelConsumption).toFixed(1)) : 0;

        return {
            totalTrips: result?.totalTrips || 0,
            totalDistance: result?.totalDistance || 0,
            totalFuelCost: result?.totalFuelCost || 0,
            totalAmortization: result?.totalAmortization || 0,
            totalExpenses: (result?.totalFuelCost || 0) + (result?.totalAmortization || 0),
            averageFuelConsumption: avgFuelConsumption
        };
    }
};