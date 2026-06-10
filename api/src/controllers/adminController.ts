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
    // Получить всех пользователей
    getUsers: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            console.log('📋 Getting all users...');

            // Получаем пользователей из БД
            const dbUsers = await all('SELECT id, email, name, role, car_model, car_year, license_plate, created_at FROM users ORDER BY id DESC');

            // Добавляем статического админа, если его нет в БД
            const hasStaticAdmin = dbUsers.some((u: any) => u.id === 0);
            let users = dbUsers;

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
                users = [staticAdmin, ...dbUsers];
            }

            console.log(`✅ Found ${users.length} users`);

            return reply.send({
                success: true,
                users
            });
        } catch (error) {
            console.error('❌ Get users error:', error);
            reply.code(500).send({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    },

    // Получить пользователя по ID
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

    // Обновить пользователя
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

    // Удалить пользователя
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

    // Получить статистику
    getStats: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            console.log('📊 Getting stats...');

            const totalUsers = await all('SELECT COUNT(*) as count FROM users');
            const totalTrips = await all('SELECT COUNT(*) as count FROM trips');

            // Добавляем статического админа в подсчет пользователей
            let userCount = totalUsers[0]?.count || 0;
            const hasStaticAdmin = await UserModel.findById(0);
            if (hasStaticAdmin) {
                // Проверяем, есть ли статический админ в БД
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
    }
};