const Router = require('express');
const BookingController = require('../controller/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = new Router();

// Создание бронирования (только авторизованные пользователи)
router.post('/', authMiddleware, BookingController.create);

// Получение всех бронирований (админ)
router.get('/', authMiddleware, BookingController.getAll);

// Получение конкретного бронирования по ID
router.get('/:id', authMiddleware, BookingController.getById);

// Получение бронирований текущего пользователя (как клиента)
router.get('/my/bookings', authMiddleware, BookingController.getMyBookings);

// Получение бронирований на объекты пользователя (как владельца)
router.get('/owner/bookings', authMiddleware, BookingController.getBookingsForMyProperties);

// Обновление статуса бронирования (только владелец объекта)
router.put('/:id/status', authMiddleware, BookingController.updateStatus);

// Удаление бронирования (только создатель брони)
router.delete('/:id', authMiddleware, BookingController.delete);

module.exports = router;