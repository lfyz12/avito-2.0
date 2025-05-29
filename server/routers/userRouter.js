const Router = require('express');
const UserController = require('../controller/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require("../middlewares/upload"); // Если будет нужно

const router = new Router();

// Регистрация
router.post('/registration', UserController.registration);

// Авторизация
router.post('/login', UserController.login);

// Выход
router.post('/logout', UserController.logout);

// Проверка авторизации
router.get('/check', UserController.checkAuth);

// Обновление токенов
router.get('/refresh', UserController.refresh);

// Обновление профиля
router.put('/profile', authMiddleware, upload.single('avatar'), UserController.updateProfile);

// Получение всех пользователей (возможно, только для админа)
router.get('/', UserController.getAll);

module.exports = router;