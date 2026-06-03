import { FastifyRequest, FastifyReply } from 'fastify';

export const validate = (schema: any) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            if (schema.body) {
                request.body = await schema.body.parseAsync(request.body);
            }
            if (schema.query) {
                request.query = await schema.query.parseAsync(request.query);
            }
            if (schema.params) {
                request.params = await schema.params.parseAsync(request.params);
            }
        } catch (error) {
            return reply.code(400).send({
                success: false,
                message: 'Validation error',
                errors: error
            });
        }
    };
};