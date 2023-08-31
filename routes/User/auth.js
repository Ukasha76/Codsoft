const express = require('express')
const user = require('../../controller/User/auth')
const auth = require('../../middleware/auth')
const catchAsync = require('../../utils/catchAsync')
const router = express.Router()

router.get('/home', auth, user.home)

router.get('/contact', auth, user.contact)

router.route('/login')
      .get(user.loginform)
      .post(catchAsync(user.login))


router.route('/signup')
      .get(user.signupform)
      .post(catchAsync(user.signup))

router.post('/logout', auth, catchAsync(user.logout))




module.exports = router