import { FastifyInstance } from 'fastify';
import { reportController } from '../controllers/reportController';
import { authenticate } from '../middleware/auth';

export default async function reportRoutes(fastify: FastifyInstance) {
    fastify.get('/stats', { preHandler: authenticate }, reportController.getStats);
}