import { FastifyRequest, FastifyReply } from 'fastify';
import { UserModel } from '../models/User';

export const adminAuth = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const userData = request.user as { id: number; email: string };

        console.log('adminAuth - userData:', userData);

        if (!userData || !userData.id) {
            reply.code(401).send({ success: false, message: 'Unauthorized' });
            return;
        }

        // Статический администратор (id=0) имеет доступ к админ-панели
        if (userData.id === 0 && userData.email === 'kooooooffe@gmail.com') {
            console.log('adminAuth - static admin granted access');
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