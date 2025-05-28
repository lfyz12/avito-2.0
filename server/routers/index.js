const Router = require('express');
const router = new Router();
const propertyRouter = require('./propertyRouter');
const userRouter = require('./userRouter');
const bookingRouter = require('./bookingRouter');
const reviewRouter = require('./reviewRouter');
const agreementRouter = require('./agreementRouter')

router.use('/user', userRouter);
router.use('/property', propertyRouter);
router.use('/booking', bookingRouter)
router.use('/review', reviewRouter)
router.use('/agreement', agreementRouter)

module.exports = router