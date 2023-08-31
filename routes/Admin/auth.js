const express = require('express')
const admin = require('../../controller/Admin/auth')
const authAdmin = require('../../middleware/authAdmin')
const catchAsync = require('../../utils/catchAsync')
const router = express.Router()


router.get('/home',authAdmin,admin.home)

router.route('/login')
        .get(admin.loginform)
        .post(catchAsync(admin.login))

router.post('/logout',authAdmin,admin.logout)


module.exports = router