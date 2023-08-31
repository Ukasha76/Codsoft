const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const user = require('../../controller/User/user')
const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/AppError')

router.route('/searchBus')
        .get(auth,catchAsync(user.searchBus))
        .post(auth,catchAsync(user.showBus))

router.route('/bookseat/:id')
        .get(auth,catchAsync(user.showseats))
        .post(auth,catchAsync(user.bookseat))
        
router.get('/mytickets',auth,catchAsync(user.mytickets))
router.get('/Bookedtickets',auth,catchAsync(user.bookedtickets))

router.get('/downloadPDF/:id',auth,catchAsync(user.downloadPDF))


router.get('/bookTicket',auth,catchAsync(user.writeSeatToken))
router.post('/bookTicket',auth,catchAsync(user. bookSeatbyToken))

module.exports = router