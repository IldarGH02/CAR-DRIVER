import { FastifyInstance } from 'fastify';
import { tripController } from '../controllers/tripController';
import { authenticate } from '../middleware/auth';

export default async function tripRoutes(fastify: FastifyInstance) {
    fastify.get('/', { preHandler: authenticate }, tripController.getAll);
    fastify.get('/:id', { preHandler: authenticate }, tripController.getById);
    fastify.post('/', { preHandler: authenticate }, tripController.create);
    fastify.put('/:id', { preHandler: authenticate }, tripController.update);
    fastify.delete('/:id', { preHandler: authenticate }, tripController.delete);
}