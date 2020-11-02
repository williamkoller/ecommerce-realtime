'use strict'

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
      const categories = await Category.query()
        .whereNull('deleted_at')
        .paginate(pagination.page, pagination.limit)
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
      const categoryFound = await Category.findByOrFail({
        title,
        deleted_at: null
      })
      if (categoryFound)
        return response.status(409).send({
          message: `This category already exists`
        })
      const category = await Category.create({
        title,
        description,
        image_id
      })
      return response.status(201).send({ data: category })
    } catch (error) {
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
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
  async show({ params: { id }, request, response, view }) {
    try {
      const category = await Category.findByOrFail({ id, deleted_at: null })
      return response.status(200).send({ data: category })
    } catch (error) {
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }

  /**
   * Update category details.
   * PUT or PATCH categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params: { id }, request, response }) {
    try {
      const category = await Category.findOrFail({ id, deleted_at: null })
      const { title, description, image_id } = request.all()
      category.merge({
        title,
        description,
        image_id
      })
      await category.save()
      return response.status(200).send({ data: category })
    } catch (error) {
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }

  /**
   * Delete a category with id.
   * DELETE categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params: { id }, request, response }) {
    try {
      const categories = await Category.findByOrFail({
        id: id,
        deleted_at: null
      })

      categories.merge({ deleted_at: new Date() })
      await categories.save()
      return response.status(200).send({ data: categories })
    } catch (error) {
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }
}

module.exports = CategoryController
