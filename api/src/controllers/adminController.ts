import { FastifyRequest, FastifyReply } from 'fastify';
import { UserModel } from '../models/User';
import { all } from '../config/database';
import {TripModel} from "../models/Trip";

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

interface TripDataInput {
    date: string;
    from: string;
    to: string;
    distance: number;
    fuelAmount: number;
    fuelCost: number;
    amortization: number;
    purpose: string;
    expenseLine?: string;
    avgConsumption?: number;
    status?: string;
}

export const adminController = {
    getUsers: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const users = await UserModel.findAll();

            // Добавляем статического админа в список, если его нет
            const hasStaticAdmin = users.some((u: any) => u.id === 0);
            if (!hasStaticAdmin) {
                const staticAdmin = {
                    id: 0,
                    email: 'kooooooffe@gmail.com',
                    name: 'Administrator',
                    role: 'admin',
                    car_model: null,
                    car_year: null,
                    license_plate: null,
                    created_at: new Date().toISOString()
                };
                users.unshift(staticAdmin);
            }

            return reply.send({ success: true, users });
        } catch (error) {
            console.error('Get users error:', error);
            reply.code(500).send({ success: false, message: 'Internal server error' });
        }
    },

    getUserById: async (request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) => {
        try {
            const id = parseInt(request.params.id);
            console.log(`📋 Getting user by id: ${id}`);

            // Сначала проверяем статического админа
            if (id === 0) {
                return reply.send({
                    success: true,
                    user: {
                        id: 0,
                        email: 'kooooooffe@gmail.com',
                        name: 'Administrator',
                        role: 'admin',
                        car_model: null,
                        car_year: null,
                        license_plate: null,
                        created_at: new Date().toISOString()
                    }
                });
            }

            const user = await UserModel.findById(id);

            if (!user) {
                return reply.code(404).send({ success: false, message: 'User not found' });
            }

            return reply.send({
                success: true,
                user
            });
        } catch (error) {
            console.error('❌ Get user error:', error);
            reply.code(500).send({ success: false, message: 'Internal server error' });
        }
    },

    updateUser: async (request: FastifyRequest<{ Params: Params; Body: UpdateUserBody }>, reply: FastifyReply) => {
        try {
            const id = parseInt(request.params.id);
            const { name, role, car_model, car_year, license_plate } = request.body;

            console.log(`📝 Updating user ${id}:`, { name, role, car_model, car_year, license_plate });

            // Запрещаем обновление статического админа
            if (id === 0) {
                return reply.code(403).send({
                    success: false,
                    message: 'Cannot update static admin'
                });
            }

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
            console.error('❌ Update user error:', error);
            reply.code(500).send({ success: false, message: 'Internal server error' });
        }
    },

    deleteUser: async (request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) => {
        try {
            const id = parseInt(request.params.id);
            console.log(`🗑️ Deleting user: ${id}`);

            // Запрещаем удаление статического админа
            if (id === 0) {
                return reply.code(403).send({
                    success: false,
                    message: 'Cannot delete static admin'
                });
            }

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
            console.error('❌ Delete user error:', error);
            reply.code(500).send({ success: false, message: 'Internal server error' });
        }
    },

    getStats: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            console.log('📊 Getting stats...');

            const totalUsers = await all('SELECT COUNT(*) as count FROM users');
            const totalTrips = await all('SELECT COUNT(*) as count FROM trips');

            let userCount = totalUsers[0]?.count || 0;
            const hasStaticAdmin = await UserModel.findById(0);
            if (hasStaticAdmin) {
                const staticAdminInDb = await all('SELECT COUNT(*) as count FROM users WHERE id = 0');
                if (staticAdminInDb[0]?.count === 0) {
                    userCount += 1;
                }
            }

            return reply.send({
                success: true,
                stats: {
                    users: userCount,
                    trips: totalTrips[0]?.count || 0
                }
            });
        } catch (error) {
            console.error('❌ Get stats error:', error);
            reply.code(500).send({ success: false, message: 'Internal server error' });
        }
    },

    getUserTrips: async (request: FastifyRequest<{ Params: { id: string }, Querystring: { dateFrom?: string; dateTo?: string } }>, reply: FastifyReply) => {
        try {
            const userId = parseInt(request.params.id);
            const { dateFrom, dateTo } = request.query;

            const user = await UserModel.findById(userId);
            if (!user) {
                return reply.code(404).send({ success: false, message: 'User not found' });
            }

            const trips = await TripModel.findAllByUserId(userId, dateFrom, dateTo);

            return reply.send({ success: true, trips });
        } catch (error) {
            console.error('Get user trips error:', error);
            reply.code(500).send({ success: false, message: 'Internal server error' });
        }
    },

    addUserTrip: async (request: FastifyRequest<{ Params: { id: string }, Body: TripDataInput }>, reply: FastifyReply) => {
        try {
            const userId = parseInt(request.params.id);
            const tripData = request.body;

            const user = await UserModel.findById(userId);
            if (!user) {
                return reply.code(404).send({ success: false, message: 'User not found' });
            }

            const tripInput = {
                userId: userId,
                date: tripData.date,
                from: tripData.from,
                to: tripData.to,
                distance: Number(tripData.distance),
                fuelAmount: Number(tripData.fuelAmount),
                fuelCost: Number(tripData.fuelCost),
                amortization: Number(tripData.amortization),
                purpose: tripData.purpose,
                expenseLine: tripData.expenseLine || null,
                avgConsumption: tripData.avgConsumption ? Number(tripData.avgConsumption) : null,
                status: tripData.status || 'completed'
            };

            const newTrip = await TripModel.create(tripInput);

            return reply.send({ success: true, trip: newTrip });
        } catch (error) {
            console.error('Add user trip error:', error);
            reply.code(500).send({ success: false, message: 'Internal server error' });
        }
    },

    deleteUserTrip: async (request: FastifyRequest<{ Params: { id: string; tripId: string } }>, reply: FastifyReply) => {
        try {
            const userId = parseInt(request.params.id);
            const tripId = parseInt(request.params.tripId);

            const user = await UserModel.findById(userId);
            if (!user) {
                return reply.code(404).send({ success: false, message: 'User not found' });
            }

            await TripModel.delete(tripId, userId);
            return reply.send({ success: true, message: 'Trip deleted successfully' });
        } catch (error) {
            console.error('Delete user trip error:', error);
            reply.code(500).send({ success: false, message: 'Internal server error' });
        }
    },

    generateUserReport: async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        try {
            const userId = parseInt(request.params.id);

            const user = await UserModel.findById(userId);
            if (!user) {
                return reply.code(404).send({ success: false, message: 'User not found' });
            }

            const trips = await TripModel.findAllByUserId(userId);
            const stats = await TripModel.getStats(userId);

            const report = {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    carModel: user.car_model,
                    carYear: user.car_year,
                    licensePlate: user.license_plate
                },
                stats,
                trips,
                generatedAt: new Date().toISOString()
            };

            return reply.send({ success: true, report });
        } catch (error) {
            console.error('Generate report error:', error);
            reply.code(500).send({ success: false, message: 'Internal server error' });
        }
    },

    createUser: async (request: FastifyRequest<{ Body: { email: string; password: string; name: string; role: string } }>, reply: FastifyReply) => {
        try {
            const { email, password, name, role } = request.body;

            if (!email || !password || !name) {
                return reply.code(400).send({ success: false, message: 'All fields are required' });
            }

            // Проверяем, не существует ли пользователь
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return reply.code(400).send({ success: false, message: 'Email already exists' });
            }

            // Создаем пользователя
            const user = await UserModel.create(email, password, name);

            // Обновляем роль если нужно
            if (role && role === 'admin') {
                await UserModel.update(user.id, { role: 'admin' });
            }

            return reply.send({ success: true, message: 'User created successfully', user });
        } catch (error) {
            console.error('Create user error:', error);
            reply.code(500).send({ success: false, message: 'Internal server error' });
        }
    }
};