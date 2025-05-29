const { Like, LikeProperties, Property, User } = require('../models/models');
const ApiError = require('../error/ApiError');

class LikeController {
    // Получить все избранные объекты текущего пользователя
    async getLikedProperties(req, res, next) {
        try {
            const userId = req.user.id;
            const like = await Like.findOne({ where: { userId } });

            if (!like) return res.json([]);

            const likedProperties = await LikeProperties.findAll({
                where: { likeId: like.id },
                include: [{ model: Property, as: 'property' }]
                ,
            });

            res.json(likedProperties.map(lp => lp.property));
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Добавить в избранное
    async add(req, res, next) {
        try {
            const userId = req.user.id;
            const { propertyId } = req.body;

            const like = await Like.findOne({ where: { userId } });
            if (!like) return next(ApiError.badRequest('Like не найден'));

            const exists = await LikeProperties.findOne({
                where: { likeId: like.id, propertyId }
            });
            if (exists) return next(ApiError.badRequest('Уже добавлено в избранное'));

            const liked = await LikeProperties.create({ likeId: like.id, propertyId });
            res.json(liked);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Удалить из избранного
    async remove(req, res, next) {
        try {
            const userId = req.user.id;
            const { propertyId } = req.params;

            const like = await Like.findOne({ where: { userId } });
            if (!like) return next(ApiError.badRequest('Like не найден'));

            const deleted = await LikeProperties.destroy({
                where: { likeId: like.id, propertyId }
            });

            res.json({ deleted });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new LikeController();
