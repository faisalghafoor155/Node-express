const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const app = require('./app')

// Handle synchronous exceptions
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION 🔥 Shutting down ...')
  console.log(err.name, err.message)
  process.exit(1)
})

const DB =
  process.env.NODE_ENV === 'development'
    ? process.env.DATABASE_LOCAL
    : process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

console.log('Connecting to database:', DB)

let server
process.on('unhandleCaughtException Error', err => {
  console.log('Unhandle Caught Exception 🔥 Shutting down ...')
  console.log(err.name, err.message)
  process.exit(1)
})
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000
  })
  .then(() => {
    console.log('Database connection successful!')
    const port = process.env.PORT || 3000
    server = app.listen(port, () => {
      console.log(`Server is running now on port ${port}`)
    })
  })
  .catch(err => {
    console.log('Database connection failed:', err.message)
    if (err.reason && err.reason.message) {
      console.log('Reason:', err.reason.message)
    }
    process.exit(1)
  })

mongoose.connection.on('error', err => {
  console.log('Mongo connection error:', err.message)
})

process.on('unhandledRejection', err => {
  console.log(err.name, err.message)
  console.log('Unhandled Rejection 🔥 Shutting down ...')
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
})
