const express = require('express');
const router = express.Router();
const authAdmin = require('../../middleware/authAdmin')
const catchAsync = require('../../utils/catchAsync')
const admin = require('../../controller/Admin/buses')




//search Bus -1
router.route('/searchBus')
    .get(authAdmin, catchAsync(admin.searchBus))
    .post(authAdmin, catchAsync(admin.showBus))
//ADD BUS -2
router.route('/addBus')
    .get(authAdmin, admin.getaddBus)
    .post(authAdmin, catchAsync(admin.postaddBus))

//EDIT BUS -3
router.get('/searchBus/edit', authAdmin, catchAsync(admin.getsearchforedit))//GIVE EDIT FORM (ALONG WITH TIME)
router.post('/searchBus/edit', authAdmin, catchAsync(admin.searchforedit))//POST THAT FORM HERE TO GET BUS ACCORDING TO TIME THEN REDIRECT TO NEXT ROUTE DIRECTLY
router.route('/editBus/:id')
    .get(authAdmin, catchAsync(admin.geteditBus))
    .patch(authAdmin, catchAsync(admin.posteditBus))

//DROP BUS -4
router.get('/searchBus/drop', authAdmin,catchAsync(admin.getsearchfordrop))//GIVE EDIT FORM (ALONG WITH TIME)
router.post('/searchBus/drop', authAdmin, catchAsync(admin.searchfordrop))//POST THAT FORM HERE TO GET BUS ACCORDING TO TIME THEN REDIRECT TO NEXT ROUTE DIRECTLY
router.delete('/dropBus/:id', authAdmin, catchAsync(admin.dropBus))

//Bus details -5
router.get('/searchBus/detail', authAdmin,catchAsync(admin.getsearchfordetail))//GIVE EDIT FORM (ALONG WITH TIME)
router.post('/searchBus/detail', authAdmin, catchAsync(admin.searchfordetail))//first search the bus and then render all details like  total seats seats booked not booked

router.get('/bus/:id', authAdmin, catchAsync(admin.getBus))

//Bus statistic -6(will need modifications after payment integration method)
router.get('/busstatistic',authAdmin,catchAsync(admin.showstatisticform))
router.post('/busstatistic',authAdmin,catchAsync(admin.showstatistic))

module.exports = router