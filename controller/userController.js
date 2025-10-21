const User = require('./../models/userModels')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

const filterObj = (obj, ...allowFields) => {
  const newObj = {}
  Object.keys(obj).forEach(el => {
    if (allowFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}
exports.getAllusers = catchAsync(async (req, res) => {
  const users = await User.find()
  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users
    }
  })
})

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route not for password  updates.Please  use  /UpdateMyPasswod'
      )
    )
  }
  const filterBody = filterObj(req.body, 'name', 'email')
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true
  })
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  })
})
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false })

  res.status(204).json({
    status: 'success',
    data: null
  })
})
exports.getUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  })
}
exports.createUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  })
}
exports.updateUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  })
}

exports.deleteUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  })
}
