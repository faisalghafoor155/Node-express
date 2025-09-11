const Tour = require('./../models/tourModel')
const APIFeature = require('./../utils/apiFeatures')
exports.aliasTopTour = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields =
    'name,duration,price,ratingsAverage,difficulty,ratingsQuantity'
  console.log('aliasTopTour set query to', req.query)
  next()
}

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
    console.log(
      'getAllTour handler called for',
      req.originalUrl,
      'query:',
      req.query
    )
    // const qerryObject = { ...req.query }
    // const objectField = ['page', 'sort', 'limit', 'fields']
    // objectField.forEach(el => delete qerryObject[el])

    // // query banate waqt let use karo
    // let query = Tour.find(qerryObject)

    // // filter operators (gte, gt, lte, lt)
    // let queryStr = JSON.stringify(qerryObject)
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    // console.log(JSON.parse(queryStr))

    // sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ') // ✅ correct
    //   console.log(sortBy)
    //   query = query.sort(sortBy) // ✅ ab assignment allowed hai (let query)
    // } else {
    //   query = query.sort('-createdAt')
    // }
    //field
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ')
    //   query.select(fields)
    // } else {
    //   query.select('-__v')
    // }
    // Pagination
    // const page = req.query.page ? parseInt(req.query.page, 10) : 1
    // const limit = req.query.limit ? parseInt(req.query.limit, 10) : 100
    // const skip = (page - 1) * limit
    // query = query.skip(skip).limit(limit)
    // if (req.query.page) {
    //   const numTour = await Tour.countDocuments()
    //   if (skip >= numTour) throw new Error('This Page Does not exist')
    // }
    const feature = new APIFeature(Tour.find(), req.query)
      .filter()
      .sort()
      .limitField()
      .paginate()
    const tour = await feature.query
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

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: {
          ratingAverage: { $gte: 4.5 }
        }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      { $sort: { avgPrice: 1 } }
    ])
    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    })
  }
}

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1
    const plan = await Tour.aggregate([
      { $unwind: '$startDates' },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStart: { $sum: 1 },
          tour: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTourStart: 1 }
      },
      {
        $limit: 6
      }
    ])
    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    })
  }
}
