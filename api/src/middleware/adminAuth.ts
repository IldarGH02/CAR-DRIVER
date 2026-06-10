import { FastifyRequest, FastifyReply } from 'fastify';
import { UserModel } from '../models/User';

export const adminAuth = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const userData = request.user as { id: number; email: string };

        console.log('adminAuth - userData:', userData);

        if (!userData || userData.id === undefined) {
            reply.code(401).send({ success: false, message: 'Unauthorized' });
            return;
        }

        const user = await UserModel.findById(userData.id);

        console.log('adminAuth - user from DB:', user);

        if (!user || user.role !== 'admin') {
            reply.code(403).send({ success: false, message: 'Admin access required' });
            return;
        }

        console.log('adminAuth - access granted');
    } catch (err) {
        console.error('adminAuth error:', err);
        reply.code(401).send({ success: false, message: 'Unauthorized' });
    }
};