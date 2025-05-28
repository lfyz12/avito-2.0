const { Property, User } = require('../models/models');
const ApiError = require('../error/ApiError');

class PropertyController {
    // Создание нового объекта недвижимости
    async create(req, res, next) {
        try {
            const ownerId = req.user.id;

            const { title, location, price, type, rooms, area, floor, totalFloors } = req.body;

            // amenities передаётся как строка: '["wifi", "tv", "kitchen"]'
            const amenities = req.body.amenities ? JSON.parse(req.body.amenities) : [];

            // Массив имён загруженных файлов
            const photos = req.files?.map(file => file.filename) || [];

            const property = await Property.create({
                title,
                location,
                price,
                type,
                rooms,
                area,
                floor,
                totalFloors,
                amenities,
                photos,
                ownerId,
            });

            return res.status(201).json(property);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }


    // Получение всех объектов недвижимости
    async getAll(req, res, next) {
        try {
            const properties = await Property.findAll({
                include: [{ model: User, as: 'owner', attributes: ['id', 'email', 'name', 'avatar'] }],
            });
            return res.json(properties);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Получение объекта по id
    async getById(req, res, next) {
        try {
            const { id } = req.params;

            const property = await Property.findByPk(id, {
                include: [{ model: User, as: 'owner', attributes: ['id', 'email', 'name', 'avatar'] }],
            });

            if (!property) return next(ApiError.badRequest('Объект не найден'));

            return res.json(property);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Обновление объекта (только владельцем)
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const property = await Property.findByPk(id);
            if (!property) return next(ApiError.badRequest('Объект не найден'));
            if (property.ownerId !== userId) return next(ApiError.forbidden('Нет доступа'));

            const { title, location, price, type, amenities, photos } = req.body;

            await property.update({ title, location, price, type, amenities, photos });

            return res.json(property);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Удаление объекта (только владельцем)
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const property = await Property.findByPk(id);
            if (!property) return next(ApiError.badRequest('Объект не найден'));
            if (property.ownerId !== userId) return next(ApiError.forbidden('Нет доступа'));

            await property.destroy();

            return res.json({ message: 'Объект удалён' });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Получение всех объектов пользователя
    async getMyProperties(req, res, next) {
        try {
            const userId = req.user.id;

            const properties = await Property.findAll({
                where: { ownerId: userId },
                include: [{ model: User, as: 'owner', attributes: ['id', 'email', 'name', 'avatar'] }],
            });

            return res.json(properties);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new PropertyController();
