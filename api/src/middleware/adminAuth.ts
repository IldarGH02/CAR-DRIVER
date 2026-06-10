import { FastifyRequest, FastifyReply } from 'fastify';
import { UserModel } from '../models/User';

export const adminAuth = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const userData = request.user as { id: number; email: string };

        console.log('adminAuth - userData:', userData);

        if (!userData || !userData.id) {
            console.log('adminAuth - no user data');
            reply.code(401).send({ success: false, message: 'Unauthorized' });
            return;
        }

        const user = await UserModel.findById(userData.id);

        console.log('adminAuth - user from DB:', user);
        console.log('adminAuth - user role:', user?.role);

        if (!user || user.role !== 'admin') {
            console.log('adminAuth - access denied, not admin');
            reply.code(403).send({ success: false, message: 'Admin access required' });
            return;
        }

        console.log('adminAuth - access granted');
    } catch (err) {
        console.error('adminAuth error:', err);
        reply.code(401).send({ success: false, message: 'Unauthorized' });
    }
};