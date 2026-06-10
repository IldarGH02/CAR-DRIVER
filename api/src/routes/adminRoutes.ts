import { FastifyInstance } from 'fastify';
import { adminController } from '../controllers/adminController';
import { authenticate } from '../middleware/auth';
import { adminAuth } from '../middleware/adminAuth';

export default async function adminRoutes(fastify: FastifyInstance) {
    fastify.addHook('preHandler', authenticate);
    fastify.addHook('preHandler', adminAuth);

    fastify.get('/users', adminController.getUsers);
    fastify.get('/users/:id', adminController.getUserById);
    fastify.put('/users/:id', adminController.updateUser);
    fastify.delete('/users/:id', adminController.deleteUser);
    fastify.post('/users', adminController.createUser);

    fastify.get('/users/:id/trips', adminController.getUserTrips);
    fastify.post('/users/:id/trips', adminController.addUserTrip);
    fastify.delete('/users/:id/trips/:tripId', adminController.deleteUserTrip);

    fastify.get('/users/:id/report', adminController.generateUserReport);

    fastify.get('/stats', adminController.getStats);
}