const flashError = require('../utils/flashError')

function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(error => {

      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors)
        var errorMessage = []
        errors.forEach(validationError => {
          errorMessage.push(validationError.properties.message)
        });
        errorMessage.forEach(message => req.flash('error', message))
        res.redirect('back')

      }
      else if (error.code === 11000) {
        req.flash('error', 'Email is already taken')
        res.redirect('back')
      }
      else if (error instanceof flashError) {

        req.flash('error', error.message)
        console.log(error.message)
        res.redirect('back');
      } else if (error.name === 'CastError') {
        error.message = ' oops an error occured'
        next(error)
      } else {
        next(error)
      }
    })

  }
}

module.exports = wrapAsync
