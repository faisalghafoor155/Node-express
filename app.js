const express = require('express')
const app = express()
const tourRouter = require('./routes/tourRoute')
const userRouter = require('./routes/userRoute')
const morgan = require('morgan')

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
app.use(express.json())
app.use(express.static(`${__dirname}/public`))
// 1) Middleware
app.use((req, res, next) => {
  console.log('Hello Middleware 🙋‍♂️')
  next()
})
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

// 2) Route Handler

// 3) Route
// app.get('/api/v1/tours', getAllTour)
// app.get('/api/v1/tours/:id', getTour)
// app.post('/api/v1/tours', createTour)
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
// 4) Start Server

module.exports = app
