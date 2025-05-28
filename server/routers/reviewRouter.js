const Router = require('express');
const ReviewController = require('../controller/reviewController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = new Router();

// Создание отзыва (только авторизованные пользователи)
router.post('/', authMiddleware, ReviewController.create);

// Получение отзывов для конкретного объекта недвижимости
router.get('/property/:propertyId', ReviewController.getForProperty);

// Получение отзывов текущего пользователя
router.get('/my', authMiddleware, ReviewController.getMyReviews);

// Удаление отзыва (только автор)
router.delete('/:id', authMiddleware, ReviewController.delete);

module.exports = router;