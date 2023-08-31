require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const app = express();
const path = require('path');
const ejsmate = require('ejs-mate')
const mongoose = require('mongoose');
const flash = require('connect-flash')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const userAuth = require('./routes/User/auth')
const adminAuth = require('./routes/Admin/auth')
const userRouter = require('./routes/User/user')
const adminRouter = require('./routes/Admin/buses');
const adminActions = require('./routes/Admin/passenger')
const payment = require('./routes/payment/payment')

//MongoDB setup
mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Mongoose Connected'))
    .catch(err => console.log(err));

// Set up MongoDB session store
const store = new MongoStore({
    mongoUrl: process.env.MONGODB,
    secret: 'Badsecret'
})
store.on("error", function (e) {
    console.log("session stroe error")
})

//Express setup
app.use(express.json())
app.use(cookieParser())
app.engine('ejs', ejsmate);
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(flash())

//Session
const sessionConfig = {
    secret: 'thisissecretforsession',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))

//Middleware and routes

app.use((req, res, next) => {
    res.locals.flashmessages = req.flash()
    next();
})

app.use('/user', userAuth)
app.use('/admin', adminAuth)
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/admin', adminActions)
app.use('/', payment)


//Error handling middleware
app.use((err, req, res, next) => {
    const { status = 500, message = 'something bad occur' } = err
    res.status(status).send(message)
})

//start the server
const port = process.env.PORT || '3000'
app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});
