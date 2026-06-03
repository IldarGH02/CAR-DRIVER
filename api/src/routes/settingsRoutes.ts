import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth';
import { settingsController } from '../controllers/settingsController';

export default async function settingsRoutes(fastify: FastifyInstance) {
    // Получение настроек
    fastify.get('/', { preHandler: authenticate }, settingsController.getSettings);

    // Обновление настроек
    fastify.put('/', { preHandler: authenticate }, settingsController.updateSettings);

    // Обновление профиля
    fastify.put('/profile', { preHandler: authenticate }, settingsController.updateProfile);
}