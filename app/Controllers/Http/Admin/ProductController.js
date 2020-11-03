'use strict'

const Product = use('App/Models/Product')
const Transformer = use('App/Transformers/Admin/ProductTransformer')
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
  async index({ request, response, transform, pagination }) {
    try {
      const name = request.input('name')
      if (!name) {
        let products = await Product.query()
          .whereNull('deleted_at')
          .paginate(pagination.page, pagination.limit)

        products = await transform.paginate(products, Transformer)
        return response.status(200).send(products)
      }
      let query = await Product.query()
        .where('name', 'ilike', `%${name}%`)
        .paginate()

      query = await transform.paginate(query, Transformer)

      return response.status(200).send(query)
    } catch (error) {
      return response.status(400).send({
        message: 'this request not performed',
        error: error.stack
      })
    }
  }

  /**
   * Create/save a new product.
   * POST products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, transform }) {
    try {
      const { name, image_id, description, price } = request.all()
      let product = await Product.create({
        name,
        image_id,
        description,
        price
      })

      product = await transform.item(product, Transformer)
      return response.status(201).send(product)
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
  async show({ params: { id }, request, response, transform }) {
    try {
      let products = await Product.findByOrFail({ id, deleted_at: null })

      products = await transform.item(products, Transformer)
      return response.status(200).send(products)
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
  async update({ params: { id }, request, response, transform }) {
    try {
      let product = await Product.findByOrFail({ id, deleted_at: null })
      const { name, image_id, description, price } = request.all()
      product.merge({
        name,
        image_id,
        description,
        price
      })
      await product.save()
      product = await transform.item(product, Transformer)
      return response.status(200).send(product)
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
      return response.status(200).send(products)
    } catch (error) {
      return response.status(400).send({
        message: error.message
      })
    }
  }
}

module.exports = ProductController
