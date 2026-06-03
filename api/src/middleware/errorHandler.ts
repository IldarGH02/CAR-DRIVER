import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';

export const errorHandler = (error: FastifyError, request: FastifyRequest, reply: FastifyReply): void => {
    request.log.error(error);

    if (error.validation) {
        reply.code(400).send({
            success: false,
            message: 'Validation error',
            errors: error.validation
        });
        return;
    }

    if (error.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER') {
        reply.code(401).send({
            success: false,
            message: 'Missing authorization header'
        });
        return;
    }

    if (error.code === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED') {
        reply.code(401).send({
            success: false,
            message: 'Token expired'
        });
        return;
    }

    reply.code(error.statusCode || 500).send({
        success: false,
        message: error.message || 'Internal server error'
    });
};