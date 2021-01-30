'use strict'

const { errorGenerator } = require('../lib/utils')
const {
  saveUser,
  findUser,
  findByIdUser,
  updateUser,
  findOneUser
} = require('../repository/users.repository')
const Joi = require('@hapi/joi')
const SERVICE_CON = 'PMS_U_S_'
const {
  PARTIAL_CONTENT,
  BAD_REQUEST
} = require('http-status-codes')
const { config } = require('../lib/utils')

const addUser = async (user, file) => {
  console.log('addUser() user: %j, files: %j', user, file)
  await validateUserInput(user)
  await isExist(user.email)
  if (file) {
    user.profile_image = file.filename
  } else {
    throw errorGenerator('Provide user profile', SERVICE_CON + PARTIAL_CONTENT,
      'Partial content', null)
  }
  const newUser = await saveUser(user)
  if (newUser && newUser.password) {
    delete newUser.password
  }
  console.log('Newly added user: %j', newUser)
  return newUser
}

async function isExist (email) {
  const user = await findOneUser({ email }, { _id: 1 })
  if (user) {
    throw errorGenerator('User already exist with this email', SERVICE_CON + BAD_REQUEST,
      'User already exist wih this email', null)
  }
}

async function validateUserInput (body) {
  const schema = Joi.object({
    first_name: Joi.string()
      .min(2)
      .max(25)
      .required(),
    last_name: Joi.string()
      .min(2)
      .max(25)
      .required(),
    email: Joi.string()
      .min(2)
      .max(250)
      .email()
      .required(),
    phone_number: Joi.string()
      .required()
  })

  try {
    const validation = await schema.validateAsync(body)
    return validation
  } catch (error) {
    throw errorGenerator(error, SERVICE_CON + PARTIAL_CONTENT,
      'Partial content', null)
  }
}

const updateSingleUser = async (user, id, file) => {
  console.log('updateUser() user: %j, id: %s, file: %j', user, id, file)
  await validateUserInput(user)
  await isExist(user.email)
  if (file) {
    user.profile_image = file.filename
  } else {
    throw errorGenerator('Provide user profile', SERVICE_CON + PARTIAL_CONTENT,
      'Partial content', null)
  }
  const updatedData = await updateUser({ _id: id }, user)
  console.log('Data after updating user: %j', updatedData)
  return updatedData
}

const getUsers = async () => {
  console.log('getUsers()')
  let users = await findUser({
    is_deleted: false
  }, userProjection())
  users = await getImageFinalPath(users)
  return users
}

async function getImageFinalPath (users) {
  console.debug('getImageFinalPath() users: %j', users)
  await Promise.all(users.map(user => {
    if (user.profile_image) {
      user.profile_image = `${config.image.protocol}://${config.image.host}:${config.port}/public/${user.profile_image}`
    }
  }))
  console.debug('getImageFinalPath() images with path: %j', users)
  return users
}

function userProjection () {
  return {
    first_name: true,
    email: true,
    profile_image: true
  }
}

const getSingleUser = async (id) => {
  console.log('getSingleUser() id: %s', id)
  const user = await findByIdUser(id, singleUserProjection())
  if (user) {
    user.profile_image = `${config.image.protocol}://${config.image.host}:${config.port}/public/${user.profile_image}`
  }
  return user
}

function singleUserProjection () {
  return {
    first_name: true,
    last_name: true,
    email: true,
    phone_number: true,
    profile_image: true
  }
}

const deleteUser = async (id) => {
  console.log('deleteUser() id: %s', id)
  const updatedData = await updateUser( { _id: id }, { is_deleted: true })
  console.log('Data after deleting user: %j', updatedData)
  return updatedData
}

module.exports = {
  addUser,
  updateSingleUser,
  getUsers,
  getSingleUser,
  deleteUser
}
