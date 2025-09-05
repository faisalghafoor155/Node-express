const mongoose = require('mongoose')
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name '],
    unique: true,
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'A tour have must duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty']
  },
  ratingAverage: {
    type: Number,
    default: 4.5
  },
  ratingQuanity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date]
})

const Tour = mongoose.model('Tour', tourSchema)

// Tour.collection.createIndex({ name: 1 }, { unique: true }).catch(err => {
//   console.log('Index creation error (probably already exists):', err.message)
// })

// const testTour = new Tour({
//   name: 'The Park View',
//   price: 480,
//   rating: 4.7
// })

// testTour
//   .save()
//   .then(doc => {
//     console.log('Tour saved successfully:', doc)
//   })
//   .catch(err => {
//     console.log('Error is 🔥', err.message)
//   })

module.exports = Tour
