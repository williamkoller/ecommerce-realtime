'use strict'

const User = use('App/Models/User')
const Transformer = use('App/Transformers/Admin/UserTransformer')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {TransformWith} ctx.transform
   */
  async index({ request, response, transform, pagination }) {
    try {
      const name = request.input('name')
      if (!name) {
        let users = await User.query()
          .whereNull('deleted_at')
          .paginate(pagination.page, pagination.limit)

        users = await transform.paginate(users, Transformer)
        return response.status(200).send(users)
      }
      let query = await User.query()
        .where('name', 'ilike', `%${name}%`)
        .orWhere('surname', 'ilike', `%${name}%`)
        .orWhere('email', 'ilike', `%%${name}`)
        .whereNull('deleted_at')
        .paginate()

      query = await transform.paginate(query, Transformer)

      return response.status(200).send(query)
    } catch (error) {
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, transform }) {
    try {
      const { name, surname, email, password } = request.all()
      const user = await User.findBy({ email, deleted_at: null })
      if (user)
        return response
          .status(409)
          .send({ message: `This user already exists with email` })
      let users = await User.create({ name, surname, email, password })

      users = await transform.item(users, Transformer)
      return response.status(201).send(users)
    } catch (error) {
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params: { id }, request, response, transform }) {
    try {
      let users = await User.findOrFail({ id, deleted_at: null })

      users = await transform.item(users, Transformer)
      return response.status(200).send(users)
    } catch (error) {
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params: { id }, request, response, transform }) {
    try {
      const { name, surname, email, password } = request.all()
      let user = await User.findOrFail({ id, deleted_at: null })
      user.merge({
        name,
        surname,
        email,
        password
      })
      await user.save()

      user = await transform.item(user, Transformer)
      return response.status(200).send(user)
    } catch (error) {
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params: { id }, transform, response }) {
    try {
      let user = await User.findOrFail({ id, deleted_at: null })
      user.merge({
        deleted_at: new Date()
      })
      await user.save()
      user = await transform.item(user, Transformer)
      return response.status(200).send(user)
    } catch (error) {
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }
}

module.exports = UserController
