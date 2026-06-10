import { FastifyRequest, FastifyReply } from 'fastify';
import { TripModel } from '../models/Trip';

export const tripController = {
    getAll: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request.user as any).id;

            // Для статического админа возвращаем пустой массив (или демо-данные)
            if (userId === 0) {
                return reply.send({ success: true, trips: [] });
            }

            const trips = await TripModel.findAllByUserId(userId);
            return reply.send({ success: true, trips });
        } catch (error) {
            console.error(error);
            return reply.code(500).send({ success: false, message: 'Server error' });
        }
    },

    getById: async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        try {
            const userId = (request.user as any).id;
            const tripId = parseInt(request.params.id);

            // Для статического админа возвращаем ошибку
            if (userId === 0) {
                return reply.code(404).send({ success: false, message: 'Trip not found' });
            }

            const trip = await TripModel.findById(tripId, userId);
            if (!trip) {
                return reply.code(404).send({ success: false, message: 'Trip not found' });
            }
            return reply.send({ success: true, trip });
        } catch (error) {
            console.error(error);
            return reply.code(500).send({ success: false, message: 'Server error' });
        }
    },

    create: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request.user as any).id;

            // Статический админ не может создавать поездки
            if (userId === 0) {
                return reply.code(403).send({
                    success: false,
                    message: 'Static admin cannot create trips. Please create a regular user account.'
                });
            }

            const data = request.body as any;
            const newTrip = await TripModel.create({ ...data, userId });
            return reply.send({ success: true, trip: newTrip });
        } catch (error) {
            console.error(error);
            return reply.code(500).send({ success: false, message: 'Server error' });
        }
    },

    update: async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        try {
            const userId = (request.user as any).id;
            const tripId = parseInt(request.params.id);

            // Статический админ не может обновлять поездки
            if (userId === 0) {
                return reply.code(403).send({
                    success: false,
                    message: 'Static admin cannot update trips'
                });
            }

            const data = request.body as any;
            await TripModel.update(tripId, userId, data);
            return reply.send({ success: true });
        } catch (error) {
            console.error(error);
            return reply.code(500).send({ success: false, message: 'Server error' });
        }
    },

    delete: async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        try {
            const userId = (request.user as any).id;
            const tripId = parseInt(request.params.id);

            // Статический админ не может удалять поездки
            if (userId === 0) {
                return reply.code(403).send({
                    success: false,
                    message: 'Static admin cannot delete trips'
                });
            }

            await TripModel.delete(tripId, userId);
            return reply.send({ success: true });
        } catch (error) {
            console.error(error);
            return reply.code(500).send({ success: false, message: 'Server error' });
        }
    }
};