const { Property, User } = require('../models/models');
const ApiError = require('../error/ApiError');
const {Op} = require("sequelize");
const {db} = require('sequelize')
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
            // Параметры пагинации
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 12;
            const offset = (page - 1) * limit;

            // Параметры сортировки
            const sortBy = req.query.sortBy || 'createdAt';
            const sortOrder = req.query.sortOrder || 'DESC';
            const validSortFields = ['price', 'createdAt', 'area', 'rooms'];
            const order = validSortFields.includes(sortBy)
                ? [[sortBy, sortOrder]]
                : [['createdAt', 'DESC']];

            // Параметры фильтрации
            const where = {};
            if (req.query.minPrice) where.price = { [Op.gte]: parseFloat(req.query.minPrice) };
            if (req.query.maxPrice) where.price = { ...where.price, [Op.lte]: parseFloat(req.query.maxPrice) };
            if (req.query.type) where.type = req.query.type;
            if (req.query.rooms) where.rooms = req.query.rooms;
            if (req.query.location) where.location = { [Op.iLike]: `%${req.query.location}%` };

            // Если есть фильтр по удобствам
            if (req.query.amenities) {
                const amenities = Array.isArray(req.query.amenities)
                    ? req.query.amenities
                    : [req.query.amenities];

                where[Op.and] = amenities.map(amenity => ({
                    amenities: { [Op.contains]: [amenity] }
                }));
            }

            // Получаем данные с пагинацией
            const { count, rows } = await Property.findAndCountAll({
                where,
                include: [{
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'email', 'name', 'phone', 'avatar']
                }],
                order,
                limit,
                offset
            });

            // Рассчитываем общее количество страниц
            const totalPages = Math.ceil(count / limit);

            return res.json({
                properties: rows,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: count,
                    itemsPerPage: limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Получение объекта по id
    async getById(req, res, next) {
        try {
            const { id } = req.params;

            const property = await Property.findByPk(id, {
                include: [{ model: User, as: 'owner', attributes: ['id', 'email', 'name', 'phone', 'avatar'] }],
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
                include: [{ model: User, as: 'owner', attributes: ['id', 'email', 'name', 'phone', 'avatar'] }],
            });

            return res.json(properties);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }



}

module.exports = new PropertyController();
