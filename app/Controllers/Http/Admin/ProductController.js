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
      const products = await Product.query()
        .whereNull('deleted_at')
        .paginate(pagination.page, pagination.limit)
      return response.status(200).send({ data: products })
    }
    const query = await Product.query()
      .where('name', 'ilike', `%${name}%`)
      .paginate()

    return response.status(200).send({ data: query })
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
      const { slug, name, image_id, description, price } = request.all()
      const productFound = await Product.findByOrFail({
        slug,
        deleted_at: null
      })
      if (productFound) {
        return response.status(409).send({
          message: `This slug already exists`
        })
      }
      const product = await Product.create({
        slug,
        name,
        image_id,
        description,
        price
      })
      return response.status(201).send({ data: product })
    } catch (error) {
     return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
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
  async show({ params: { id }, request, response, view }) {
    try {
      const products = await Product.findByOrFail({ id, deleted_at: null })
      return response.status(200).send({ data: products })
    } catch (error) {
      response.status(400).send({
        error: error.message
      })
    }
  }

  /**
   * Update product details.
   * PUT or PATCH products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params: { id }, request, response }) {
    try {
      const products = await Product.findByOrFail({ id, deleted_at: null })
      const { slug, name, image_id, description, price } = request.all()
      products.merge({
        slug,
        name,
        image_id,
        description,
        price
      })
      await products.save()
      return response.status(201).send({ data: products })
    } catch (error) {
     return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }

  /**
   * Delete a product with id.
   * DELETE products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params: { id }, request, response }) {
    try {
      const products = await Product.findByOrFail({
        id: id,
        deleted_at: null
      })

      products.merge({ deleted_at: new Date() })
      await products.save()
      return response.status(201).send(products)
    } catch (error) {
      return response.status(400).send({
        message: error.message
      })
    }
  }
}

module.exports = ProductController
