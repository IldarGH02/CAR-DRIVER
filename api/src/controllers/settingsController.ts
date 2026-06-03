import { FastifyRequest, FastifyReply } from 'fastify';
import { UserModel } from '../models/User';
import { SettingsModel } from '../models/Settings'; // ← добавить импорт

export const settingsController = {
    // Получение настроек пользователя
    getSettings: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request.user as any).id;
            let settings = await SettingsModel.getSettings(userId); // ← ИСПРАВЛЕНО

            if (!settings) {
                // Если настроек нет, создаем стандартные
                await SettingsModel.createSettings(userId); // ← ИСПРАВЛЕНО
                settings = await SettingsModel.getSettings(userId); // ← ИСПРАВЛЕНО
            }

            return reply.send({ success: true, settings });
        } catch (error) {
            console.error('Get settings error:', error);
            reply.code(500).send({ success: false, message: 'Internal server error' });
        }
    },

    // Обновление настроек пользователя
    updateSettings: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request.user as any).id;
            const data = request.body as any;

            // Проверяем, существуют ли настройки
            const existingSettings = await SettingsModel.getSettings(userId); // ← ИСПРАВЛЕНО
            if (!existingSettings) {
                await SettingsModel.createSettings(userId); // ← ИСПРАВЛЕНО
            }

            await SettingsModel.updateSettings(userId, data); // ← ИСПРАВЛЕНО
            const settings = await SettingsModel.getSettings(userId); // ← ИСПРАВЛЕНО

            return reply.send({ success: true, settings });
        } catch (error) {
            console.error('Update settings error:', error);
            reply.code(500).send({ success: false, message: 'Internal server error' });
        }
    },

    // Обновление профиля пользователя (этот метод правильный, не меняем)
    updateProfile: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request.user as any).id;
            const data = request.body as any;

            await UserModel.update(userId, {
                name: data.name,
                car_model: data.carModel,
                car_year: data.carYear,
                license_plate: data.licensePlate
            });

            const user = await UserModel.findById(userId);

            return reply.send({
                success: true,
                user: {
                    id: user?.id,
                    email: user?.email,
                    name: user?.name,
                    carModel: user?.car_model,
                    carYear: user?.car_year,
                    licensePlate: user?.license_plate
                }
            });
        } catch (error) {
            console.error('Update profile error:', error);
            reply.code(500).send({ success: false, message: 'Internal server error' });
        }
    }
};