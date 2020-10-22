'use strict'

const Response = require('@adonisjs/framework/src/Response')

const Category = use('App/Models/Category')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with categories
 */
class CategoryController {
  /**
   * Show a list of all categories.
   * GET categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   * @param {Object} ctx.pagination
   */
  async index({ request, response, view, pagination }) {
    const title = request.input('title')
    if (!title) {
      const categories = await Category.query().paginate(
        pagination.page,
        pagination.limit
      )
      return response.status(200).send(categories)
    }
    const query = await Category.query()
      .where('title', 'ilike', `%${title}%`)
      .paginate()

    return response.status(200).send(query)
  }

  /**
   * Create/save a new category.
   * POST categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    try {
      const { title, description, image_id } = request.all()
      const categoryFound = await Category.findBy({ title })
      if (categoryFound)
        return response
          .status(400)
          .send({ message: 'This category already exists' })
      const category = await Category.create({ title, description, image_id })
      return response.status(201).send(category)
    } catch (error) {
      return response.status(400).send({
        message: error.message,
      })
    }
  }

  /**
   * Display a single category.
   * GET categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    const category = await Category.findOrFail()
  }

  /**
   * Update category details.
   * PUT or PATCH categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a category with id.
   * DELETE categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = CategoryController
