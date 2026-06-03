import { FastifyRequest, FastifyReply } from 'fastify';

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        await request.jwtVerify();
        console.log('Authenticated user:', request.user);
    } catch (err) {
        console.log('Auth failed:', err);
        reply.code(401).send({ success: false, message: 'Unauthorized' });
    }
};