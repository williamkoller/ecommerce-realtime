'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const Product = use('App/Models/Product')
const Transformer = use('App/Transformers/Admin/ProductTransformer')

class ProductController {
  /**
   * Show a list of all products.
   * GET products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index({ request, response, pagination, transform }) {
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
   */
  async show({ params: { id }, response, transform }) {
    try {
      let product = await Product.findOrFail(id)

      product = await transform.item(product, Transformer)
      return response.status(200).send(product)
    } catch (error) {
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }
}

module.exports = ProductController
