const Router = require('express');
const router = new Router();
const LikeController = require('../controller/LikeController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, LikeController.getLikedProperties);
router.post('/', authMiddleware, LikeController.add);
router.delete('/:propertyId', authMiddleware, LikeController.remove);

module.exports = router;
