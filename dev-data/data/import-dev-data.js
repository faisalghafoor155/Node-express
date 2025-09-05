const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')

// Load environment variables - fix the path
dotenv.config({ path: path.join(__dirname, '../../config.env') })

const Tour = require('./../../models/tourModel')

// Add debug logging to check if env vars are loaded
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('DATABASE_LOCAL:', process.env.DATABASE_LOCAL)
console.log('DATABASE:', process.env.DATABASE)

const DB =
  process.env.NODE_ENV === 'development'
    ? process.env.DATABASE_LOCAL
    : process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

console.log('Connecting to database:', DB)

mongoose
  .connect(DB)
  .then(() => {
    console.log('Database connection successful!')
  })
  .catch(err => {
    console.log('Database connection failed:', err)
  })

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
)

const importData = async () => {
  try {
    await Tour.create(tours)
    console.log('Data successfully loaded!')
    process.exit()
  } catch (err) {
    console.log(err)
    process.exit()
  }
}

const deleteData = async () => {
  try {
    await Tour.deleteMany()
    console.log('Data deleted successfully!')
    process.exit()
  } catch (err) {
    console.log(err)
    process.exit()
  }
}

if (process.argv[2] === '--import') {
  importData()
} else if (process.argv[2] === '--delete') {
  deleteData()
}

console.log(process.argv)
