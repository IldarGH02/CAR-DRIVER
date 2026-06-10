import { FastifyInstance } from 'fastify';
import { adminController } from '../controllers/adminController';
import { authenticate } from '../middleware/auth';
import { adminAuth } from '../middleware/adminAuth';

export default async function adminRoutes(fastify: FastifyInstance) {
    fastify.addHook('preHandler', authenticate);
    fastify.addHook('preHandler', adminAuth);

    // Управление пользователями
    fastify.get('/users', adminController.getUsers);
    fastify.get('/users/:id', adminController.getUserById);
    fastify.put('/users/:id', adminController.updateUser);
    fastify.delete('/users/:id', adminController.deleteUser);
    fastify.post('/users', adminController.createUser);

    // Статистика
    fastify.get('/stats', adminController.getStats);
}