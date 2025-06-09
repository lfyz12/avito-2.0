const Router = require('express');
const AgreementController = require('../controller/agreementController');

const router = new Router();

router.post('/', AgreementController.create);
router.get('/:id', AgreementController.getOne);
router.get('/booking/:bookingId', AgreementController.getByBooking);
router.get('/download/:id', AgreementController.download);


module.exports = router;
