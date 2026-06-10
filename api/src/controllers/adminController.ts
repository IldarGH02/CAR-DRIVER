import { FastifyRequest, FastifyReply } from 'fastify';
import { UserModel } from '../models/User';
import { all } from '../config/database';

interface UpdateUserBody {
    name?: string;
    role?: string;
    car_model?: string;
    car_year?: string;
    license_plate?: string;
}

interface Params {
    id: string;
}

export const adminController = {
    getUsers: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const users = await UserModel.findAll();
            return reply.send({
                success: true,
                users
            });
        } catch (error) {
            console.error('Get users error:', error);
            reply.code(500).send({ success: false, message: 'Internal server error' });
        }
    },

    getUserById: async (request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) => {
        try {
            const id = parseInt(request.params.id);
            const user = await UserModel.findById(id);

            if (!user) {
                return reply.code(404).send({ success: false, message: 'User not found' });
            }

            return reply.send({
                success: true,
                user
            });
        } catch (error) {
            console.error('Get user error:', error);
            reply.code(500).send({ success: false, message: 'Internal server error' });
        }
    },

    updateUser: async (request: FastifyRequest<{ Params: Params; Body: UpdateUserBody }>, reply: FastifyReply) => {
        try {
            const id = parseInt(request.params.id);
            const { name, role, car_model, car_year, license_plate } = request.body;

            const existingUser = await UserModel.findById(id);
            if (!existingUser) {
                return reply.code(404).send({ success: false, message: 'User not found' });
            }

            await UserModel.update(id, { name, role, car_model, car_year, license_plate });

            const updatedUser = await UserModel.findById(id);
            return reply.send({
                success: true,
                user: updatedUser
            });
        } catch (error) {
            console.error('Update user error:', error);
            reply.code(500).send({ success: false, message: 'Internal server error' });
        }
    },

    deleteUser: async (request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) => {
        try {
            const id = parseInt(request.params.id);

            const existingUser = await UserModel.findById(id);
            if (!existingUser) {
                return reply.code(404).send({ success: false, message: 'User not found' });
            }

            await UserModel.delete(id);

            return reply.send({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            console.error('Delete user error:', error);
            reply.code(500).send({ success: false, message: 'Internal server error' });
        }
    },

    getStats: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const totalUsers = await all('SELECT COUNT(*) as count FROM users');
            const totalTrips = await all('SELECT COUNT(*) as count FROM trips');

            return reply.send({
                success: true,
                stats: {
                    users: totalUsers[0]?.count || 0,
                    trips: totalTrips[0]?.count || 0
                }
            });
        } catch (error) {
            console.error('Get stats error:', error);
            reply.code(500).send({ success: false, message: 'Internal server error' });
        }
    }
};