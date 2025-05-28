const { Booking, Property, User } = require('../models/models');
const ApiError = require('../error/ApiError');

class BookingController {
    // Создание бронирования пользователем
    async create(req, res, next) {
        try {
            const userId = req.user.id;
            const { propertyId, startDate, endDate, totalPrice } = req.body;

            const property = await Property.findByPk(propertyId);
            if (!property) return next(ApiError.badRequest('Недвижимость не найдена'));

            const booking = await Booking.create({
                userId,
                propertyId,
                startDate,
                endDate,
                totalPrice,
                status: 'new',
            });

            return res.status(201).json(booking);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Получение всех бронирований (админ или аналитика)
    async getAll(req, res, next) {
        try {
            const bookings = await Booking.findAll({
                include: [
                    { model: User, as: 'client', attributes: ['id', 'email', 'name'] },
                    { model: Property },
                ],
            });

            return res.json(bookings);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Получение бронирования по id
    async getById(req, res, next) {
        try {
            const { id } = req.params;

            const booking = await Booking.findByPk(id, {
                include: [
                    { model: User, as: 'client', attributes: ['id', 'email', 'name'] },
                    { model: Property },
                ],
            });

            if (!booking) return next(ApiError.badRequest('Бронирование не найдено'));

            return res.json(booking);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Получение всех бронирований пользователя
    async getMyBookings(req, res, next) {
        try {
            const userId = req.user.id;

            const bookings = await Booking.findAll({
                where: { userId },
                include: [{ model: Property }],
            });

            return res.json(bookings);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Получение бронирований на объекты текущего пользователя (владелец)
    async getBookingsForMyProperties(req, res, next) {
        try {
            const userId = req.user.id;

            const properties = await Property.findAll({ where: { ownerId: userId } });
            const propertyIds = properties.map(p => p.id);

            const bookings = await Booking.findAll({
                where: { propertyId: propertyIds },
                include: [
                    { model: User, as: 'client', attributes: ['id', 'email', 'name'] },
                    { model: Property },
                ],
            });

            return res.json(bookings);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Обновление статуса (только владелец объекта может подтвердить или отклонить)
    async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body; // 'confirmed' | 'declined'
            const userId = req.user.id;

            const booking = await Booking.findByPk(id, {
                include: [{ model: Property }],
            });

            if (!booking) return next(ApiError.badRequest('Бронирование не найдено'));

            if (booking.Property.ownerId !== userId)
                return next(ApiError.forbidden('Нет доступа для изменения статуса'));

            booking.status = status;
            await booking.save();

            return res.json(booking);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Удаление бронирования пользователем (если статус new)
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const booking = await Booking.findByPk(id);

            if (!booking) return next(ApiError.badRequest('Бронирование не найдено'));
            if (booking.userId !== userId) return next(ApiError.forbidden('Нет доступа'));
            if (booking.status !== 'new')
                return next(ApiError.badRequest('Можно удалить только новое бронирование'));

            await booking.destroy();

            return res.json({ message: 'Бронирование удалено' });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new BookingController();
