import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth';
import { adminController } from '../controllers/adminController';
import { adminAuth } from '../middleware/adminAuth';

export default async function adminRoutes(fastify: FastifyInstance) {
    // Все маршруты требуют авторизации
    fastify.addHook('preHandler', authenticate);

    // Маршруты админа (дополнительная проверка)
    fastify.get('/users', { preHandler: [adminAuth] }, adminController.getAllUsers);
    fastify.post('/users', { preHandler: [adminAuth] }, adminController.createUser);
    fastify.put('/users/:id', { preHandler: [adminAuth] }, adminController.updateUser);
    fastify.delete('/users/:id', { preHandler: [adminAuth] }, adminController.deleteUser);
    fastify.get('/users/:userId/trips', { preHandler: [adminAuth] }, adminController.getUserTrips);
    fastify.post('/users/:userId/trips', { preHandler: [adminAuth] }, adminController.addUserTrip);
    fastify.delete('/users/:userId/trips/:tripId', { preHandler: [adminAuth] }, adminController.deleteUserTrip);
}