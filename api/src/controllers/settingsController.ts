import { FastifyRequest, FastifyReply } from 'fastify';
import { UserModel } from '../models/User';
import { SettingsModel } from '../models/Settings';

export const settingsController = {
    getSettings: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request.user as any).id;

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

    updateSettings: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request.user as any).id;
            const data = request.body as any;

            console.log('Update settings - userId:', userId);
            console.log('Update settings - amortization_rate:', data.amortization_rate);

            let settings = await SettingsModel.getSettings(userId);
            if (!settings) {
                await SettingsModel.createSettings(userId);
            }

            await SettingsModel.updateSettings(userId, {
                currency: data.currency,
                distance_unit: data.distance_unit,
                fuel_unit: data.fuel_unit,
                amortization_rate: parseFloat(data.amortization_rate) || 2.68,
                notifications: data.notifications,
                auto_save: data.auto_save
            });

            const updatedSettings = await SettingsModel.getSettings(userId);
            console.log('Updated settings amortization_rate:', updatedSettings?.amortization_rate);

            return reply.send({ success: true, settings: updatedSettings });
        } catch (error) {
            console.error('Update settings error:', error);
            reply.code(500).send({ success: false, message: 'Internal server error' });
        }
    },

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
                    role: user?.role,
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