import { FastifyRequest, FastifyReply } from 'fastify';
import { TripModel } from '../models/Trip';

export const reportController = {
    getStats: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request.user as any).id;
            const { dateFrom, dateTo } = request.query as any;
            const stats = await TripModel.getStats(userId, dateFrom, dateTo);
            return reply.send({ success: true, stats });
        } catch (error) {
            console.error(error);
            return reply.code(500).send({ success: false, message: 'Server error' });
        }
    }
};