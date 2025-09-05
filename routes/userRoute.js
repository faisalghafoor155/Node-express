const express = require('express')
const userController = require('./../controller/userController')
const route = express.Router()

route
  .route('/')
  .get(userController.getAllusers)
  .post(userController.createUsers)
route
  .route('/:id')
  .get(userController.getUsers)
  .patch(userController.updateUsers)
  .delete(userController.deleteUsers)

module.exports = route
