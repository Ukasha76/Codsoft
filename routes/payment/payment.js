const express = require('express');
const payment = require('../../controller/payment/payment')
const auth = require('../../middleware/auth')
const catchAsync = require('../../utils/catchAsync')

const router = express.Router()

router.route('/payment/:id')
        .get(auth,catchAsync(payment.renderBuyPage))
        .post(auth,catchAsync(payment.payment))


module.exports = router;
    