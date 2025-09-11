class APIFeature {
  constructor (query, queryString) {
    this.query = query
    this.queryString = queryString
  }

  filter () {
    const qerryObject = { ...this.queryString }
    const objectField = ['page', 'sort', 'limit', 'fields']
    objectField.forEach(el => delete qerryObject[el])

    // filter operators (gte, gt, lte, lt)
    let queryStr = JSON.stringify(qerryObject)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    this.query = this.query.find(JSON.parse(queryStr))
    return this
  }

  sort () {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort('-createdAt')
    }
    return this
  }

  limitField () {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ')
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select('-__v')
    }
    return this
  }

  paginate () {
    const page = this.queryString.page ? parseInt(this.queryString.page, 10) : 1
    const limit = this.queryString.limit
      ? parseInt(this.queryString.limit, 10)
      : 100
    const skip = (page - 1) * limit
    this.query = this.query.skip(skip).limit(limit)
    return this
  }
}

module.exports = APIFeature
