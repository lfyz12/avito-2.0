const { Review, User, Property } = require('../models/models');
const ApiError = require('../error/ApiError');

class ReviewController {
    // Создание отзыва
    async create(req, res, next) {
        try {
            const authorId = req.user.id;
            const { propertyId, rating, text } = req.body;

            const property = await Property.findByPk(propertyId);
            if (!property) return next(ApiError.badRequest('Недвижимость не найдена'));

            // (Опционально) запретить повторные отзывы одного пользователя
            const existing = await Review.findOne({ where: { propertyId, authorId } });
            if (existing) return next(ApiError.badRequest('Вы уже оставили отзыв на этот объект'));

            const review = await Review.create({
                authorId,
                propertyId,
                rating,
                text,
            });

            return res.status(201).json(review);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Получение всех отзывов к объекту недвижимости
    async getForProperty(req, res, next) {
        try {
            const { propertyId } = req.params;

            const reviews = await Review.findAll({
                where: { propertyId },
                include: {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'name', 'phone', 'email', 'avatar'],
                },
                order: [['createdAt', 'DESC']],
            });

            return res.json(reviews);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Получение всех отзывов пользователя
    async getMyReviews(req, res, next) {
        try {
            const authorId = req.user.id;

            const reviews = await Review.findAll({
                where: { authorId },
                include: [{ model: Property }],
            });

            return res.json(reviews);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Удаление отзыва (только автор)
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const review = await Review.findByPk(id);
            if (!review) return next(ApiError.badRequest('Отзыв не найден'));
            if (review.authorId !== userId) return next(ApiError.forbidden('Нет доступа'));

            await review.destroy();

            return res.json({ message: 'Отзыв удалён' });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new ReviewController();
