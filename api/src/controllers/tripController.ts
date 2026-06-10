import { FastifyRequest, FastifyReply } from 'fastify';
import { TripModel } from '../models/Trip';

export const tripController = {
    getAll: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request.user as any).id;
            const trips = await TripModel.findAllByUserId(userId);
            return reply.send({ success: true, trips });
        } catch (error) {
            return reply.code(500).send({ success: false, message: 'Server error' });
        }
    },

    getById: async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        try {
            const userId = (request.user as any).id;
            const tripId = parseInt(request.params.id);

            const trip = await TripModel.findById(tripId, userId);
            if (!trip) {
                return reply.code(404).send({ success: false, message: 'Trip not found' });
            }
            return reply.send({ success: true, trip });
        } catch (error) {
            return reply.code(500).send({ success: false, message: 'Server error' });
        }
    },

    create: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request.user as any).id;
            const data = request.body as any;

            const newTrip = await TripModel.create({ ...data, userId });
            return reply.send({ success: true, trip: newTrip });
        } catch (error) {
            return reply.code(500).send({ success: false, message: 'Server error' });
        }
    },

    update: async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        try {
            const userId = (request.user as any).id;
            const tripId = parseInt(request.params.id);
            const data = request.body as any; // 👈 Добавлено: получаем data из запроса

            await TripModel.update(tripId, userId, data);
            return reply.send({ success: true });
        } catch (error) {
            return reply.code(500).send({ success: false, message: 'Server error' });
        }
    },

    delete: async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        try {
            const userId = (request.user as any).id;
            const tripId = parseInt(request.params.id);

            await TripModel.delete(tripId, userId);
            return reply.send({ success: true });
        } catch (error) {
            return reply.code(500).send({ success: false, message: 'Server error' });
        }
    }
};