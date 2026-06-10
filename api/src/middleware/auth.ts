import { FastifyRequest, FastifyReply } from 'fastify';

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        await request.jwtVerify();
        console.log('authenticate - success, user:', request.user);
    } catch (err) {
        console.error('authenticate error:', err);
        reply.code(401).send({ success: false, message: 'Unauthorized' });
    }
};