const Tour = require('./../models/tourModel')

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(404).json({
      status: 'fail',
      message: 'Name and Price not found'
    })
  }
  next()
}
exports.getAllTour = async (req, res) => {
  try {
    const qerryObject = { ...req.query }
    const objectField = ['page', 'sort', 'limit', 'fields']
    objectField.forEach(el => delete qerryObject[el])

    // query banate waqt let use karo
    let query = Tour.find(qerryObject)

    // filter operators (gte, gt, lte, lt)
    let queryStr = JSON.stringify(qerryObject)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    console.log(JSON.parse(queryStr))

    // sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ') // ✅ correct
      console.log(sortBy)
      query = query.sort(sortBy) // ✅ ab assignment allowed hai (let query)
    } else {
      query = query.sort('-createdAt')
    }
    //field
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ')
      query.select(fields)
    } else {
      query.select('-__v')
    }
    //pagination

    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 100
    const skip = (page - 1) * limit
    query = query.skip(skip).limit(limit)
    if (req.query.page) {
      const numTour = await Tour.countDocuments()
      if (skip >= numTour) throw new Error('This Page Does not exist')
    }

    const tour = await query
    res.status(200).json({
      status: 'success',
      result: tour.length,
      data: {
        tour
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    })
  }
}

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    })
  }
}

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body)

    res.status(201).json({
      status: 'Success',
      data: {
        tour: newTour
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid data sent'
    })
  }
}

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid data sent'
    })
  }
}

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: 'Success',
      data: null
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid data sent'
    })
  }
}
