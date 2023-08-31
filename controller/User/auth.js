const User = require('../../model/user')

const home = (req, res) => {
    res.render('user/nav/home', { tittle: 'Home' })
}
const contact = (req, res) => {
    res.render('user/nav/contact', { tittle: 'Contact' })
}
const signupform = (req, res) => {
    res.render('user/auth/signup', { tittle: 'SignUp' })
}

const signup = async (req, res, next) => {
    const user = new User(req.body)
    const token = await user.genauthtoken()

    res.cookie('Authorization', token)
    req.flash('success', 'Welcome to Seat Reservation App!')

    res.redirect('/user/home')
}

const loginform = (req, res) => {
    res.render('user/auth/login', { tittle: 'Login' })
}
const login = async (req, res, next) => {
    const user1 = await User.findbyCredentials(req.body.email, req.body.password)
    const token = await user1.genauthtoken()
    res.cookie('Authorization', token)
    req.flash('success', 'Welcome Back!')
    res.redirect('/user/searchBus')

}

const logout = async (req, res) => {
    
    req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
    await req.user.save()

    res.redirect('/user/login')
}

module.exports = {

    home,
    contact,
    signupform,
    signup,
    loginform,
    login,
    logout,

}