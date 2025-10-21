const crypto = require('crypto')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const User = require('./../models/userModels')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const sendEmail = require('./../utils/email')

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

exports.createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  })
}
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body)
  exports.createSendToken(newUser, 201, res)
})

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400))
  }
  const user = await User.findOne({ email }).select('+password')
  console.log(user)
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401))
  }
  exports.createSendToken(user, 201, res)
})

exports.protect = catchAsync(async (req, res, next) => {
  let token
  // 1) Getting token and check of  it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    )
  }
  // 2) Validate token format and verify token
  if (typeof token !== 'string' || token === 'undefined' || token === 'null') {
    return next(new AppError('Invalid token. Please log in again.', 401))
  }

  // Basic JWT structure check to avoid jwt malformed
  if (token.split('.').length !== 3) {
    return next(new AppError('Invalid token format. Please log in again.', 401))
  }

  let decoded
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please log in again.', 401))
    }
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Your token has expired! Please log in again.', 401))
    }
    return next(err)
  }
  console.log(decoded)
  // 3) Check if user still exist
  const currentUser = await User.findById(decoded.id)
  if (!currentUser) {
    return next(
      new AppError(
        'The User belonging to this token does no longer exist ',
        401
      )
    )
  }
  // 4) Check if user changed password after the token  was issued
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('User rectly changed password! Please login again ', 401)
    )
  }
  req.user = currentUser
  next()
})

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      )
    }
    next()
  }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new AppError('There is no user with email', 404))
  }

  const resetToken = user.createPasswordResetToken()

  await user.save({ validateBeforeSave: false })
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`

  const message = `Forgot your password ? Submit a PATCH request with your new password and confirmPassword to :${resetURL}.\nIf didn't forgot your password ,pleas ignore this email `
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    })
    return res.status(200).json({
      status: 'success',
      message: 'Token sent email!'
    })
  } catch (err) {
    console.error('Email send failed:', err)
    user.passwordResetToken = undefined
    user.passwordResetExpire = undefined

    await user.save({ validateBeforeSave: false })
    return next(
      new AppError(
        'There was an error sending  the email.Try again later !',
        500
      )
    )
  }
})
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1)Get user based on there token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gt: Date.now() }
  })
  //2) If token has  not expired ,and there is user ,set  the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400))
  }
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetExpire = undefined
  await user.save()
  //3 ) Update a changePasswordAt property for the user
  //4) log the user in send JWT
  exports.createSendToken(user, 200, res)
})

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1) Get User from collection
  const user = await User.findById(req.user.id).select('+password')
  //2) Check if Posted current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your password is wrong', 401))
  }
  //3) if , so update
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  await user.save()
  //4) Log user in , send JWT
  exports.createSendToken(user, 200, res)
})
