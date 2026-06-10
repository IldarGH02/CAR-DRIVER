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

        const existing = await SettingsModel.findByUserId(userId);

        if (!existing) {
            await SettingsModel.createSettings(userId);
        }

        if (data.amortization_rate !== undefined) {
            const rate = Number(data.amortization_rate);
            await run('UPDATE settings SET amortization_rate = ? WHERE user_id = ?', [rate, userId]);
        }
        if (data.currency !== undefined) {
            await run('UPDATE settings SET currency = ? WHERE user_id = ?', [data.currency, userId]);
        }
        if (data.distance_unit !== undefined) {
            await run('UPDATE settings SET distance_unit = ? WHERE user_id = ?', [data.distance_unit, userId]);
        }
        if (data.fuel_unit !== undefined) {
            await run('UPDATE settings SET fuel_unit = ? WHERE user_id = ?', [data.fuel_unit, userId]);
        }
        if (data.notifications !== undefined) {
            await run('UPDATE settings SET notifications = ? WHERE user_id = ?', [data.notifications ? 1 : 0, userId]);
        }
        if (data.auto_save !== undefined) {
            await run('UPDATE settings SET auto_save = ? WHERE user_id = ?', [data.auto_save ? 1 : 0, userId]);
        }

        const updated = await SettingsModel.findByUserId(userId);

        return updated;
    },

    update: async (userId: number, data: any) => {
        return SettingsModel.updateSettings(userId, data);
    }
};