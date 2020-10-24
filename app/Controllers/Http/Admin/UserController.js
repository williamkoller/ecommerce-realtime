'use strict'

const User = use('App/Models/User')

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
   * @param {View} ctx.view
   */
  async index({ request, response, view, pagination }) {
    try {
      const name = request.input('name')
      if (!name) {
        const users = await User.query().paginate(
          pagination.page,
          pagination.limit
        )
        return response.status(200).send(users)
      }
      const query = await User.query()
        .where('name', 'ilike', `%${name}%`)
        .paginate()

      return response.status(200).send(query)
    } catch (error) {
      return response.status(400).send({
        error: error.message
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
  async store({ request, response }) {
    try {
      const { name, surname, email, password } = request.all()
      const user = await User.findBy({ email })
      if (user)
        return response
          .status(400)
          .send({ message: `This ${user.email} already exists` })
      const users = await User.create({ name, surname, email, password })

      return response.status(201).send({ users })
    } catch (error) {
      return response.status(400).send({
        error: error.message
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
  async show({ params, request, response, view }) {}

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = UserController
