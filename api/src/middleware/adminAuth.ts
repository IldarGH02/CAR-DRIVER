import { FastifyRequest, FastifyReply } from 'fastify';
import { UserModel } from '../models/User';

export const adminAuth = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const userData = request.user as { id: number; email: string };

        if (!userData || !userData.id) {
            reply.code(401).send({ success: false, message: 'Unauthorized' });
            return;
        }

        const user = await UserModel.findById(userData.id);

        if (!user || user.role !== 'admin') {
            reply.code(403).send({ success: false, message: 'Admin access required' });
            return;
        }
    } catch (err) {
        console.error('adminAuth error:', err);
        reply.code(401).send({ success: false, message: 'Unauthorized' });
    }
};