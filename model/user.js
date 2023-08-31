const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Schema } = mongoose
const flashError = require('../utils/flashError')
const userSchema = new Schema({
  username: {
    type: String,
    required: [true,'Username required']
  },
  email: {
    type: String,
    required:  [true,'Email required'],
    trim: true,
    unique: [true, 'Email already exist'], // Custom error message for email uniqueness
    validate: {
      validator: function (value) {
        const domain = value.split('@')[1];
        return validator.isEmail(value) && domain === 'gmail.com';
      },
      message: 'Email is not correct!'
    }
  },
  
  password: {
    type: String,
    required:  [true,'Password Required'],
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
    required: [true, 'Phone Number required'],
    validate: {
      validator: function(value) {
        // Define the desired minimum and maximum length for the phone number
        const minLength = 8; // For example, minimum of 8 digits
        const maxLength = 15; // For example, maximum of 15 digits

        // Convert the number to a string to count the digits
        const phoneNumberStr = value.toString();

        // Validate the length
        return phoneNumberStr.length >= minLength && phoneNumberStr.length <= maxLength;
      },
      message: 'Phone number must be between 8 and 15 digits'
    }
  },
  tokens: [{
      token: {type: String}
    }]
})
userSchema.methods.genauthtoken = async function(){
  const { _id } = this
  const token = jwt.sign({_id},process.env.SECRET)
  this.tokens.push({token})
   await this.save()

  return token
}

userSchema.statics.findbyCredentials = async(email,password)=>{
  const user = await User.findOne({email})
  if(!user){
    throw new flashError("Invalid Email or Password")
  }
  const isMatch = await bcrypt.compare(password,user.password)
  if(!isMatch){
    throw new flashError("Invalid Email or Password")
  }

  return user
}




userSchema.pre('save', async function (next) {

  if (this.isModified('password')) {

    this.password = await bcrypt.hash(this.password, 8)
  }
  next()
})









const User = new mongoose.model('User', userSchema)
module.exports = User