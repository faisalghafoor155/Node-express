const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name '],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must less or equal then 40 characters'],
      minlength: [10, 'A tour name must more or equal then 10 characters'],
      validate: {
        validator: function (val) {
          // allow spaces along with alphabets in the tour name
          return /^[A-Za-z ]+$/.test(val)
        },
        message: 'Tour name must only contain letters and spaces'
      }
    },
    // store URL-friendly slug (created from `name` in pre-save middleware)
    slug: String,
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
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either:easy,medium,difficulr'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      alias: 'ratingAverage'
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
      alias: 'ratingQuanity'
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          if (this instanceof mongoose.Model) {
            return val < this.price
          }
          // For update validators: use the document being updated when available
          if (this && this.getUpdate) {
            const update = this.getUpdate()
            const price = update.price || (update.$set && update.$set.price)
            if (typeof price === 'number') {
              return val < price
            }
          }
          // If price not provided in update, fall back to allowing current value
          return true
        },
        message: 'Discount Price ({VALUE}) should be below regular price'
      }
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
    // mark tours as secret (won't be shown in public listings if used in queries)
    secretTour: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date]
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.ratingAverage
        delete ret.ratingQuanity
        return ret
      }
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.ratingAverage
        delete ret.ratingQuanity
        return ret
      }
    }
  }
)
tourSchema.virtual('durationWeek').get(function () {
  return this.duration / 7
})
// Document middleware: runs before .save() and .create()
// Note: earlier the schema used the field name `slugify` which caused the
// middleware to write to `this.slug` while the schema expected `slugify`.
// With Mongoose's default strict mode, properties not defined in the schema
// are ignored on save. That mismatch made the generated slug not persist.
// We rename the schema field to `slug` and set it here.
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })

  // console.log('Will save document; slug set to:', this.slug)
  next()
})
// tourSchema.post('save', function (doc, next) {
//   console.log(doc)
//   next()
// })
//Query Middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } })
  this.start = Date.now()
  next()
})
tourSchema.post(/^find/, function (docs, next) {
  // console.log(`Query Took ${Date.now() - this.start} millisecond`)
  // console.log(docs)
  next()
})
tourSchema.pre('aggregate', function (next) {
  // console.log(this.pipeline())
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
  next()
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
