import { FastifyRequest, FastifyReply } from 'fastify';
import { UserModel } from '../models/User';

export const adminAuth = async (request: FastifyRequest, reply: FastifyReply) => {
    console.log('=== adminAuth middleware ===');
    console.log('Request user:', request.user);

    try {
        const user = await UserModel.findById((request.user as any).id);
        console.log('User from DB:', user);
        console.log('User role:', user?.role);

        if (!user || user.role !== 'admin') {
            console.log('Access denied - not admin');
            reply.code(403).send({ success: false, message: 'Admin access required' });
            return;
        }
        console.log('Access granted - admin');
    } catch (err) {
        console.error('adminAuth error:', err);
        reply.code(401).send({ success: false, message: 'Unauthorized' });
    }
};