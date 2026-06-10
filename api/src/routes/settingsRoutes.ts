import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth';
import { settingsController } from '../controllers/settingsController';

export default async function settingsRoutes(fastify: FastifyInstance) {
    fastify.addHook('preHandler', authenticate);

    fastify.get('/', settingsController.getSettings);
    fastify.put('/', settingsController.updateSettings);
    fastify.put('/profile', settingsController.updateProfile);
}