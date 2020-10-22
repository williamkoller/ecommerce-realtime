'use strict'

const Product = use('App/Models/Product')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with products
 */
class ProductController {
  /**
   * Show a list of all products.
   * GET products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view, pagination }) {
    const name = request.input('name')
    if (!name) {
      const products = await Product.query().paginate(
        pagination.page,
        pagination.limit
      )
      return response.status(200).send(products)
    }
    const query = await Product.query()
      .where('name', 'ilike', `%${name}%`)
      .paginate()

    return response.status(200).send(query)
  }

  /**
   * Create/save a new product.
   * POST products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    try {
      const { name, image_id, description, price } = request.all()
      const productFound = await Product.findBy({ name })
      if (productFound) {
        return response.status(400).send({
          message: `This Product: ${productFound.name} already exists`
        })
      }
      const product = await Product.create({
        name,
        image_id,
        description,
        price
      })
      return response.status(201).send(product)
    } catch (error) {
      return response.status(400).send({
        error: error.message
      })
    }
  }

  /**
   * Display a single product.
   * GET products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Update product details.
   * PUT or PATCH products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a product with id.
   * DELETE products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = ProductController
