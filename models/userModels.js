const mongoose = require('mongoose')
const validate = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell your user name']
  },
  email: {
    type: String,
    required: [true, 'Provide  Your Email'],
    unique: true,
    lowercase: true,
    validate: [validate.isEmail, 'Please provide Email']
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide p assword'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirem your password'],
    validate: {
      validator: function (el) {
        return el === this.password
      },
      message: 'Passwords are not the same'
    }
  },
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExpire: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
})

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next()
  // this.passwordChangeAt = Date.now() - 1000
  next()
})
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } })
  next()
})
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined
  next()
})
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword)
}
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changeTimestamp = parseInt(this.passwordChangeAt.getTime() / 1000, 10)
    return JWTTimestamp < changeTimestamp
  }
  return false
}
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex')
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.passwordResetExpire = Date.now() + 10 * 60 * 1000
  console.log({ resetToken, passwordResetToken: this.passwordResetToken })
  return resetToken
}

// // Temporary alias to support existing controller usage
// userSchema.methods.correctPasswordResetToken = function () {
//   return this.createPasswordResetToken()
// }
const user = mongoose.model('User', userSchema)

module.exports = user
