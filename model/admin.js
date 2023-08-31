const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError')
const flashError = require('../utils/flashError')
const { Schema } = mongoose
const adminSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,

    validate: {
      validator: function (value) {
        return validator.isEmail(value)
      },
      message: 'Email is not correct!'
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate:
    {
      validator: function (value) {
        return !value.includes('password')
      },
      message: 'Password shlould not  includes {Password}'
    }
  },
  phoneNumber: {
    type: Number,
    required: true
  },
  tokens: [{
    token: { type: String }
  }]
})
adminSchema.methods.genauthtoken = async function () {
  const { _id } = this
  const token = jwt.sign({ _id }, process.env.SECRET)
  this.tokens.push({ token })
  await this.save()
  return token
}

adminSchema.statics.findbyCredentials = async function(email, password) {

    const admin = await Admin.findOne({ email })

    if (!admin) {
      throw new flashError("Invalid Email or Password")
    }

    const isMatch = await bcrypt.compare(password, admin.password)

    if (!isMatch) {
      throw new flashError("Invalid Email or Password")
    }
   
  
    return admin

}





adminSchema.pre('save', async function (next) {

  if (this.isModified('password')) {

    this.password = await bcrypt.hash(this.password, 8)
  }
  next()
})










const Admin = new mongoose.model('Admin', adminSchema)
module.exports = Admin