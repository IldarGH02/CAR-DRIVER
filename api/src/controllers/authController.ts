import { FastifyRequest, FastifyReply } from 'fastify';
import { UserModel } from '../models/User';

interface RegisterBody {
    email: string;
    password: string;
    name: string;
}

interface LoginBody {
    email: string;
    password: string;
}

export const authController = {
    register: async (request: FastifyRequest<{ Body: RegisterBody }>, reply: FastifyReply) => {
        const { email, password, name } = request.body;

        if (!email || !password || !name) {
            return reply.code(400).send({
                success: false,
                message: 'All fields are required'
            });
        }

        try {
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return reply.code(400).send({
                    success: false,
                    message: 'Email already exists'
                });
            }

            const user = await UserModel.create(email, password, name);
            const fullUser = await UserModel.findById(user.id);

            return reply.send({
                success: true,
                user: {
                    id: fullUser?.id,
                    email: fullUser?.email,
                    name: fullUser?.name,
                    role: fullUser?.role || 'user',
                    carModel: fullUser?.car_model,
                    carYear: fullUser?.car_year,
                    licensePlate: fullUser?.license_plate
                }
            });
        } catch (error) {
            reply.code(500).send({ success: false, message: 'Internal server error' });
        }
    },

    login: async (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
        const { email, password } = request.body;

        if (!email || !password) {
            return reply.code(400).send({
                success: false,
                message: 'Email and password are required'
            });
        }

        try {
            const user = await UserModel.findByEmail(email);
            if (!user) {
                return reply.code(401).send({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const isValid = await UserModel.verifyPassword(password, user.password);
            if (!isValid) {
                return reply.code(401).send({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const token = await reply.jwtSign({ id: user.id, email: user.email });
            const fullUser = await UserModel.findById(user.id);

            return reply.send({
                success: true,
                token,
                user: {
                    id: fullUser?.id,
                    email: fullUser?.email,
                    name: fullUser?.name,
                    role: fullUser?.role || 'user',
                    carModel: fullUser?.car_model,
                    carYear: fullUser?.car_year,
                    licensePlate: fullUser?.license_plate
                }
            });
        } catch (error) {
            reply.code(500).send({ success: false, message: 'Internal server error' });
        }
    },

    getMe: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userData = request.user as { id: number; email: string };

            if (!userData || !userData.id) {
                return reply.code(401).send({
                    success: false,
                    message: 'Unauthorized'
                });
            }

            const user = await UserModel.findById(userData.id);

            if (!user) {
                return reply.code(404).send({
                    success: false,
                    message: 'User not found'
                });
            }

            return reply.send({
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role || 'user',
                    carModel: user.car_model,
                    carYear: user.car_year,
                    licensePlate: user.license_plate
                }
            });
        } catch (error) {
            reply.code(500).send({ success: false, message: 'Internal server error' });
        }
    }
};