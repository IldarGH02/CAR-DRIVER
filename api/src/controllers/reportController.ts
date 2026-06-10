import { FastifyRequest, FastifyReply } from 'fastify';
import { TripModel } from '../models/Trip';

export const reportController = {
    getStats: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request.user as any).id;
            const { dateFrom, dateTo } = request.query as any;

            if (userId === 0) {
                return reply.send({
                    success: true,
                    stats: {
                        totalDistance: 0,
                        totalFuelCost: 0,
                        totalAmortization: 0,
                        totalTrips: 0,
                        avgConsumption: 0,
                        tripsByPurpose: {},
                        monthlyData: []
                    }
                });
            }

            const stats = await TripModel.getStats(userId, dateFrom, dateTo);
            return reply.send({ success: true, stats });
        } catch (error) {
            return reply.code(500).send({ success: false, message: 'Server error' });
        }
    }
};