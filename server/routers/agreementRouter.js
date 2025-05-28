const Router = require('express');
const AgreementController = require('../controller/agreementController');

const router = new Router();

router.post('/', AgreementController.create);
router.get('/:id', AgreementController.getOne);
router.get('/booking/:bookingId', AgreementController.getByBooking);
router.delete('/:id', AgreementController.delete); // по желанию

module.exports = router;
