import { FastifyRequest, FastifyReply } from 'fastify';
import { UserModel } from '../models/User';

export const adminAuth = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const userData = request.user as { id: number; email: string };

        console.log('=== adminAuth ===');
        console.log('userData:', userData);

        if (!userData || !userData.id) {
            console.log('No user data');
            reply.code(401).send({ success: false, message: 'Unauthorized' });
            return;
        }

        // Статический администратор (id=0) имеет доступ к админ-панели
        if (userData.id === 0 && userData.email === 'kooooooffe@gmail.com') {
            console.log('Static admin granted access');
            return;
        }

        const user = await UserModel.findById(userData.id);
        console.log('User from DB:', user);
        console.log('User role:', user?.role);

        if (!user || user.role !== 'admin') {
            console.log('Access denied - not admin');
            reply.code(403).send({ success: false, message: 'Admin access required' });
            return;
        }

        console.log('Access granted');
    } catch (err) {
        console.error('adminAuth error:', err);
        reply.code(401).send({ success: false, message: 'Unauthorized' });
    }
};