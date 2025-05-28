const Router = require('express');
const PropertyController = require('../controller/propertyController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
const router = new Router();

// Создание объекта недвижимости (требует аутентификации)
router.post('/', authMiddleware, upload.array('photos'), PropertyController.create);


// Получение всех объектов (доступно без аутентификации)
router.get('/', PropertyController.getAll);

// Получение объекта по ID (доступно без аутентификации)
router.get('/:id', PropertyController.getById);

// Обновление объекта (только владелец)
router.put('/:id', authMiddleware, PropertyController.update);

// Удаление объекта (только владелец)
router.delete('/:id', authMiddleware, PropertyController.delete);

// Получение объектов текущего пользователя (требует аутентификации)
router.get('/my/properties', authMiddleware, PropertyController.getMyProperties);

module.exports = router;