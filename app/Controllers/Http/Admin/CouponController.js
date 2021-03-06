'use strict'

const Coupon = use('App/Models/Coupon')
const Database = use('Database')
const Service = use('App/Services/Coupon/CouponService')
const Transformer = use('App/Transformers/Admin/CouponTransformer')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with coupons
 */
class CouponController {
  /**
   * Show a list of all coupons.
   * GET coupons
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Pagination} pagination
   */
  async index({ request, response, pagination, transform }) {
    try {
      const code = request.input('code')
      if (!code) {
        let coupons = await Coupon.query()
          .whereNull('deleted_at')
          .paginate(pagination.page, pagination.limit)
        coupons = await transform.paginate(coupons, Transformer)
        return response.status(201).send(coupons)
      }
      let query = await Coupon.query()
        .whereNull('deleted_at')
        .where('code', 'ilike', `%${code}%`)
        .paginate()

      query = await transform.paginate(query, Transformer)
      return response.status(201).send(query)
    } catch (error) {
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }

  /**
   * Create/save a new coupon.
   * POST coupons
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, transform }) {
    /**
     * 1 - product - can only be used on specific products
     * 2 - clients - can only be used by specific customers
     * 3 - clients and products - can only be used by specific products and customers
     * 4 - can be used by any customer on any order
     */
    try {
      const trx = await Database.beginTransaction()
      const can_user_for = {
        client: false,
        product: false
      }
      const CouponData = request.only([
        'code',
        'discount',
        'valid_from',
        'valid_util',
        'quantity',
        'type',
        'recursive'
      ])
      const { users, products } = request.only(['users', 'products'])
      let coupon = await Coupon.create(CouponData, trx)
      // starts service layer
      const service = new Service(coupon, trx)

      if (users && users.lenght > 0) {
        await service.syncUsers(users)
        can_user_for.client = true
      }

      if (products && products.length > 0) {
        await service.syncProducts(products)
        can_user_for.product = true
      }

      if (can_user_for.product && can_user_for.client) {
        coupon.can_user_for = 'product_client'
      } else if (can_user_for.product && !can_user_for.client) {
        coupon.can_user_for = 'product'
      } else if (!can_user_for.product && can_user_for.client) {
        coupon.can_user_for = 'client'
      } else {
        coupon.can_user_for = 'all'
      }

      await Coupon.save(trx)
      await trx.commit()

      coupon = await transform
        .include('users, products')
        .item(coupon, Transformer)
      return response.status(201).send(coupon)
    } catch (error) {
      await trx.rollback()
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }

  /**
   * Display a single coupon.
   * GET coupons/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params: { id }, request, response, transform }) {
    try {
      let coupons = await Coupon.findOrFail(id)
      coupons = await transform
        .include('products,users,orders')
        .item(coupons, Transformer)
      return response.status(200).send(coupons)
    } catch (error) {
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }

  /**
   * Update coupon details.
   * PUT or PATCH coupons/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params: { id }, request, response, transform }) {
    try {
      const trx = await Database.beginTransaction()
      let coupon = await Coupon.findOrFail(id)
      const can_user_for = {
        client: false,
        product: false
      }
      const CouponData = request.only([
        'code',
        'discount',
        'valid_from',
        'valid_util',
        'quantity',
        'type',
        'recursive'
      ])
      coupon.merge(CouponData)

      const { users, products } = request.only(['users', 'products'])

      const service = new Service(coupon, trx)

      if (users && users.lenght > 0) {
        await service.syncUsers(users)
        can_user_for.client = true
      }

      if (products && products.length > 0) {
        await service.syncProducts(products)
        can_user_for.product = true
      }

      if (can_user_for.product && can_user_for.client) {
        coupon.can_user_for = 'product_client'
      } else if (can_user_for.product && !can_user_for.client) {
        coupon.can_user_for = 'product'
      } else if (!can_user_for.product && can_user_for.client) {
        coupon.can_user_for = 'client'
      } else {
        coupon.can_user_for = 'all'
      }

      await coupon.save(trx)
      await trx.commit()

      coupon = await transform.item(coupon, Transformer)

      return response.status(200).send(coupon)
    } catch (error) {
      await trx.rollback()
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }

  /**
   * Delete a coupon with id.
   * DELETE coupons/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params: { id }, transform, response }) {
    try {
      let coupon = await Coupon.findOrFail({ id, deleted_at: null })
      coupon.merge({ deleted_at: new Date() })
      await coupon.save()

      coupon = await transform.item(coupon, Transformer)
      return response.status(200).send(coupon)
    } catch (error) {
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }
}

module.exports = CouponController
