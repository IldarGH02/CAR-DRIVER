import { FastifyRequest, FastifyReply } from 'fastify';
import { UserModel } from '../models/User';
import { TripModel } from '../models/Trip';

export const adminController = {
    checkAdmin: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const user = await UserModel.findById((request.user as any).id);
            if (user?.role !== 'admin') {
                reply.code(403).send({ success: false, message: 'Access denied. Admin rights required.' });
                return false;
            }
            return true;
        } catch (error) {
            console.error('Check admin error:', error);
            reply.code(500).send({ success: false, message: 'Server error' });
            return false;
        }
    },

    getAllUsers: async (request: FastifyRequest, reply: FastifyReply) => {
        const isAdmin = await adminController.checkAdmin(request, reply);
        if (!isAdmin) return;

        try {
            const users = await UserModel.findAll();
            return reply.send({ success: true, users });
        } catch (error) {
            console.error('Error in getAllUsers:', error);
            reply.code(500).send({ success: false, message: 'Server error' });
        }
    },

    createUser: async (request: FastifyRequest<{ Body: { email: string; password: string; name: string; role?: string } }>, reply: FastifyReply) => {
        const isAdmin = await adminController.checkAdmin(request, reply);
        if (!isAdmin) return;

        const { email, password, name, role } = request.body;

        if (!email || !password || !name) {
            return reply.code(400).send({ success: false, message: 'All fields are required' });
        }

        try {
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return reply.code(400).send({ success: false, message: 'Email already exists' });
            }

            const user = await UserModel.create(email, password, name);

            if (role && role !== 'user') {
                await UserModel.update(user.id, { role });
                const updatedUser = await UserModel.findById(user.id);
                return reply.send({ success: true, user: updatedUser });
            }

            return reply.send({ success: true, user });
        } catch (error) {
            console.error(error);
            reply.code(500).send({ success: false, message: 'Server error' });
        }
    },

    updateUser: async (request: FastifyRequest<{ Params: { id: string }; Body: { name?: string; role?: string; carModel?: string; carYear?: string; licensePlate?: string } }>, reply: FastifyReply) => {
        const isAdmin = await adminController.checkAdmin(request, reply);
        if (!isAdmin) return;

        const userId = parseInt(request.params.id);
        const data = request.body;

        try {
            await UserModel.update(userId, {
                name: data.name,
                role: data.role,
                car_model: data.carModel,
                car_year: data.carYear,
                license_plate: data.licensePlate
            });

            const user = await UserModel.findById(userId);
            return reply.send({ success: true, user });
        } catch (error) {
            console.error(error);
            reply.code(500).send({ success: false, message: 'Server error' });
        }
    },

    deleteUser: async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        const isAdmin = await adminController.checkAdmin(request, reply);
        if (!isAdmin) return;

        const userId = parseInt(request.params.id);

        try {
            await UserModel.delete(userId);
            return reply.send({ success: true });
        } catch (error) {
            console.error(error);
            reply.code(500).send({ success: false, message: 'Server error' });
        }
    },

    getUserTrips: async (request: FastifyRequest<{ Params: { userId: string }; Querystring: { dateFrom?: string; dateTo?: string } }>, reply: FastifyReply) => {
        const isAdmin = await adminController.checkAdmin(request, reply);
        if (!isAdmin) return;

        const userId = parseInt(request.params.userId);
        const { dateFrom, dateTo } = request.query;

        try {
            const trips = await TripModel.findAllByUserId(userId);

            let filteredTrips = trips;
            if (dateFrom) {
                filteredTrips = filteredTrips.filter(trip => trip.date >= dateFrom);
            }
            if (dateTo) {
                filteredTrips = filteredTrips.filter(trip => trip.date <= dateTo);
            }

            return reply.send({ success: true, trips: filteredTrips });
        } catch (error) {
            console.error(error);
            reply.code(500).send({ success: false, message: 'Server error' });
        }
    },

    addUserTrip: async (request: FastifyRequest<{ Params: { userId: string }; Body: {
            date: string;
            from: string;
            to: string;
            distance: number;
            fuelAmount: number;
            fuelCost: number;
            amortization: number;
            purpose: string;
            expenseLine?: string;
            status?: string
        } }>, reply: FastifyReply) => {
        const isAdmin = await adminController.checkAdmin(request, reply);
        if (!isAdmin) return;

        const userId = parseInt(request.params.userId);
        const data = request.body;

        try {
            const newTrip = await TripModel.create({
                userId: userId,
                date: data.date,
                from: data.from,
                to: data.to,
                distance: data.distance,
                fuelAmount: data.fuelAmount,
                fuelCost: data.fuelCost,
                amortization: data.amortization,
                purpose: data.purpose,
                expenseLine: data.expenseLine,
                status: data.status || 'completed'
            });
            return reply.send({ success: true, trip: newTrip });
        } catch (error) {
            console.error(error);
            reply.code(500).send({ success: false, message: 'Server error' });
        }
    },

    deleteUserTrip: async (request: FastifyRequest<{ Params: { userId: string; tripId: string } }>, reply: FastifyReply) => {
        const isAdmin = await adminController.checkAdmin(request, reply);
        if (!isAdmin) return;

        const userId = parseInt(request.params.userId);
        const tripId = parseInt(request.params.tripId);

        try {
            await TripModel.delete(tripId, userId);
            return reply.send({ success: true });
        } catch (error) {
            console.error(error);
            reply.code(500).send({ success: false, message: 'Server error' });
        }
    }
};