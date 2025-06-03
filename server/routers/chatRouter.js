const Router = require('express');
const chatController = require('../controller/chatController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload')
const router = Router.Router();


// Создание бронирования (только авторизованные пользователи)
router.post('/', authMiddleware, chatController.createChat);

router.get('/:userId', authMiddleware, chatController.getChatUsers);

// Получение конкретного бронирования по ID
router.get('/messages/:chatId', authMiddleware, chatController.getChatMessages);

router.get('/user/:chatId', authMiddleware, chatController.getChatById);

router.post(
    '/upload',
    upload.single('file'),
    chatController.uploadFile
);

router.get(
    '/files/:filename',
    chatController.getFile
);


module.exports = router;
