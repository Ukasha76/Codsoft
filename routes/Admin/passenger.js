const express = require('express');
const router = express.Router();
const passenger = require('../../controller/Admin/passenger')
const catchAsync = require('../../utils/catchAsync')
const authAdmin = require('../../middleware/authAdmin')


router.get('/passengerDetail',authAdmin,catchAsync(passenger.searchbus))
router.post('/passengerDetail',authAdmin,catchAsync(passenger.showPassengers ))

router.get('/passengerDetail/:id',authAdmin,catchAsync(passenger.pasengerDetail))



module.exports = router