import { FastifyRequest, FastifyReply } from 'fastify';
import { UserModel } from '../models/User';
import { SettingsModel } from '../models/Settings';

export const settingsController = {
    // Получение настроек пользователя
    getSettings: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request.user as any).id;

            // Для статического админа возвращаем стандартные настройки
            if (userId === 0) {
                return reply.send({
                    success: true,
                    settings: {
                        currency: 'RUB',
                        distance_unit: 'km',
                        fuel_unit: 'liters',
                        amortization_rate: 2.68,
                        notifications: true,
                        auto_save: true
                    }
                });
            }

            let settings = await SettingsModel.getSettings(userId);

            if (!settings) {
                await SettingsModel.createSettings(userId);
                settings = await SettingsModel.getSettings(userId);
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

            // Статический админ не может обновлять настройки
            if (userId === 0) {
                return reply.send({
                    success: true,
                    message: 'Static admin settings cannot be modified',
                    settings: {
                        currency: 'RUB',
                        distance_unit: 'km',
                        fuel_unit: 'liters',
                        amortization_rate: 2.68,
                        notifications: true,
                        auto_save: true
                    }
                });
            }

            const data = request.body as any;

            const existingSettings = await SettingsModel.getSettings(userId);
            if (!existingSettings) {
                await SettingsModel.createSettings(userId);
            }

            await SettingsModel.updateSettings(userId, data);
            const settings = await SettingsModel.getSettings(userId);

            return reply.send({ success: true, settings });
        } catch (error) {
            console.error('Update settings error:', error);
            reply.code(500).send({ success: false, message: 'Internal server error' });
        }
    },

    // Обновление профиля пользователя
    updateProfile: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request.user as any).id;

            // Статический админ не может обновлять профиль
            if (userId === 0) {
                return reply.send({
                    success: true,
                    message: 'Static admin profile cannot be modified',
                    user: {
                        id: 0,
                        email: 'kooooooffe@gmail.com',
                        name: 'Administrator',
                        role: 'admin',
                        carModel: null,
                        carYear: null,
                        licensePlate: null
                    }
                });
            }

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