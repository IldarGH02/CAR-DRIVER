import { FastifyRequest, FastifyReply } from 'fastify';

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        console.log('Authenticate - headers:', request.headers.authorization);
        await request.jwtVerify();
        console.log('Authenticate - success, user:', request.user);
    } catch (err) {
        console.error('Authenticate error:', err);
        reply.code(401).send({ success: false, message: 'Unauthorized' });
    }
};