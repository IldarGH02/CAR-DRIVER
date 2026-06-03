import { get, run } from '../config/database';

export const SettingsModel = {
    findByUserId: async (userId: number) => {
        const row = await get('SELECT * FROM settings WHERE user_id = ?', [userId]);
        return row;
    },

    update: async (userId: number, data: any) => {
        const fields: string[] = [];
        const values: any[] = [];

        if (data.currency !== undefined) {
            fields.push('currency = ?');
            values.push(data.currency);
        }
        if (data.distance_unit !== undefined) {
            fields.push('distance_unit = ?');
            values.push(data.distance_unit);
        }
        if (data.fuel_unit !== undefined) {
            fields.push('fuel_unit = ?');
            values.push(data.fuel_unit);
        }
        if (data.amortization_rate !== undefined) {
            fields.push('amortization_rate = ?');
            values.push(data.amortization_rate);
        }
        if (data.notifications !== undefined) {
            fields.push('notifications = ?');
            values.push(data.notifications ? 1 : 0);
        }
        if (data.auto_save !== undefined) {
            fields.push('auto_save = ?');
            values.push(data.auto_save ? 1 : 0);
        }

        if (fields.length === 0) return;

        values.push(userId);
        await run(`UPDATE settings SET ${fields.join(', ')} WHERE user_id = ?`, values);
    }
};