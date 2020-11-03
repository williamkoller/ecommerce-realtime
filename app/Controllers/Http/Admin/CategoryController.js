'use strict'

const Category = use('App/Models/Category')
const Transformer = use('App/Transformers/Admin/CategoryTransformer')

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
   * @param {TransformWith} ctx.transform
   * @param {Object} ctx.pagination
   */
  async index({ request, response, transform, pagination }) {
    try {
      const title = request.input('title')
      if (!title) {
        let categories = await Category.query().paginate(
          pagination.page,
          pagination.limit
        )

        categories = await transform.paginate(categories, Transformer)
        return response.status(200).send(categories)
      }
      let query = await Category.query()
        .where('title', 'ilike', `%${title}%`)
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
   * Create/save a new category.
   * POST categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, transform }) {
    try {
      const { title, description, image_id } = request.all()
      const categoryFound = await Category.findBy({ title, deleted_at: null })
      if (categoryFound)
        return response.status(409).send({
          message: `This category already exists`
        })
      let category = await Category.create({
        title,
        description,
        image_id
      })
      category = await transform.item(category, Transformer)
      return response.status(201).send(category)
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
   * @param {TransformWith} ctx.transform
   */
  async show({ params: { id }, request, response, transform }) {
    try {
      let category = await Category.findByOrFail({ id, deleted_at: null })
      category = await transform.item(category, Transformer)
      return response.status(200).send(category)
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
  async update({ params: { id }, request, response, transform }) {
    try {
      let category = await Category.findOrFail({ id, deleted_at: null })
      const { title, description, image_id } = request.all()
      category.merge({
        title,
        description,
        image_id
      })
      await category.save()
      category = await transform.item(category, Transformer)
      return response.status(200).send(category)
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
  async destroy({ params: { id }, request, response, transform }) {
    try {
      let category = await Category.findByOrFail({
        id: id,
        deleted_at: null
      })

      category.merge({ deleted_at: new Date() })
      await category.save()
      category = await transform.item(category, Transformer)
      return response.status(200).send(category)
    } catch (error) {
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }
}

module.exports = CategoryController
