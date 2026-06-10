import { get, run } from '../config/database';

const DEFAULT_SETTINGS = {
    currency: 'RUB',
    distance_unit: 'km',
    fuel_unit: 'liters',
    amortization_rate: 2.68,
    notifications: 1,
    auto_save: 1
};

export const SettingsModel = {
    findByUserId: async (userId: number) => {
        const row = await get('SELECT * FROM settings WHERE user_id = ?', [userId]);
        return row || null;
    },

    getSettings: async (userId: number) => {
        let settings = await SettingsModel.findByUserId(userId);
        if (!settings) {
            return { user_id: userId, ...DEFAULT_SETTINGS };
        }
        return settings;
    },

    createSettings: async (userId: number, data?: any) => {
        return run(
            `INSERT INTO settings (user_id, currency, distance_unit, fuel_unit, amortization_rate, notifications, auto_save)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                data?.currency || DEFAULT_SETTINGS.currency,
                data?.distance_unit || DEFAULT_SETTINGS.distance_unit,
                data?.fuel_unit || DEFAULT_SETTINGS.fuel_unit,
                data?.amortization_rate || DEFAULT_SETTINGS.amortization_rate,
                data?.notifications !== undefined ? (data.notifications ? 1 : 0) : DEFAULT_SETTINGS.notifications,
                data?.auto_save !== undefined ? (data.auto_save ? 1 : 0) : DEFAULT_SETTINGS.auto_save
            ]
        );
    },

    updateSettings: async (userId: number, data: any) => {
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
            values.push(parseFloat(data.amortization_rate));
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
        const query = `UPDATE settings SET ${fields.join(', ')} WHERE user_id = ?`;
        await run(query, values);
    },

    update: async (userId: number, data: any) => {
        return SettingsModel.updateSettings(userId, data);
    }
};