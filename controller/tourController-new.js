const fs = require('fs')

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
)

exports.checkId = (req, res, next, val) => {
  console.log(`id is ${val}`)
  const id = parseInt(val, 10)
  const tour = tours.find(el => el.id === id)
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    })
  }
  next()
}

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Name and Price not found'
    })
  }
  next()
}
exports.getAllTour = (req, res) => {
  console.log(req.requestTime)

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    result: tours.length,
    data: {
      tours
    }
  })
}

exports.getTour = (req, res) => {
  const id = req.params.id * 1
  const tour = tours.find(el => el.id === id)
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  })
}
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1
  const newTours = Object.assign({ id: newId }, req.body)

  tours.push(newTours)
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      console.log(err)
    }
  )
  res.status(201).json({
    status: 'success',
    data: {
      tours: newTours
    }
  })
}

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<updated tour here..>'
    }
  })
}

exports.deleteTour = (req, res) => {
  res.status(204).json({
    data: null
  })
}
