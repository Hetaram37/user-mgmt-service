'use strict'

const router = require('express').Router()
const {
  addNewUser,
  updateSpecificUser,
  getAllUser,
  getSpecificUser,
  getEmpProjectList,
  removeUser
} = require('../controller/users.controller')
const { uploadFiles } = require('../middleware/upload')

router.post('/', uploadFiles.single('profile_image'), addNewUser)
router.put('/:id', uploadFiles.single('profile_image'), updateSpecificUser)
router.get('/', getAllUser)
router.get('/:id', getSpecificUser)
router.delete('/:id', removeUser)

module.exports = router
