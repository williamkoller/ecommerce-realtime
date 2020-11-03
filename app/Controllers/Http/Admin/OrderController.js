'use strict'

const Order = use('App/Models/Order')
const Service = use('App/Services/Order/OrderService')
const Coupon = use('App/Models/Coupon')
const Discount = use('App/Models/Discount')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with orders
 */
class OrderController {
  /**
   * Show a list of all orders.
   * GET orders
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, pagination }) {
    try {
      const { status, id } = request.only(['status', 'id'])

      const query = Order.query()
      if (status && id) {
        query.where('status', status).orWhere('id', 'ILIKE', `${id}`)
      } else if (status) {
        query.where('status', status)
      } else if (id) {
        query.where('id', 'ILIKE', `${id}`)
      }

      const coupons = await query.paginate(pagination.page, pagination.limit)

      return response.status(200).send(coupons)
    } catch (error) {
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }

  /**
   * Create/save a new order.
   * POST orders
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    try {
      const trx = await Database.beginTransaction()
      const { user_id, items, status } = request.all()
      const order = await Order.create({ user_id, items, status })
      const service = new Service(order, trx)
      if (items && items.length > 0) {
        await service.syncItems(items)
      }
      await trx.commit()
      return response.status(201).send(order)
    } catch (error) {
      await trx.rollback()
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }

  /**
   * Display a single order.
   * GET orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params: { id }, request, response, view }) {
    try {
      const coupons = await Coupon.findOrFail(id)
      return response.status(200).send(coupons)
    } catch (error) {
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }

  /**
   * Update order details.
   * PUT or PATCH orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params: { id }, request, response }) {
    try {
      const order = await Order.findOrFail(id)
      const trx = await Database.beginTransaction()
      const { user_id, items, status } = request.all()

      order.merge({
        user_id,
        status
      })
      const service = await new Service(order, trx)
      service.syncUpdateItems(items)
      await order.save(trx)
      await trx.commit()

      return response.status(200).send(order)
    } catch (error) {
      await trx.rollback()
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }

  /**
   * Delete a order with id.
   * DELETE orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params: { id }, request, response }) {
    try {
      const coupon = await Coupon.findOrFail({ id, deleted_at: null })
      coupon.merge({
        deleted_at: new Date()
      })
      await coupon.save()
      return response.status(200).send(coupon)
    } catch (error) {
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }
  /**
   *
   * @param {*} { params: { id }, request, response }
   * @memberof OrderController
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async applyDiscount({ params: { id }, request, response }) {
    try {
      const { code } = request.all()
      const coupon = await Coupon.findByOrFail('code', code.toUpperCase())
      const order = await Order.findOrFail(id)

      const info = {}

      const service = new Service(order)
      const canAddDiscount = await service.canApplyDiscount(coupon)
      const orderDiscounts = await order.coupons().getCount()

      const canApplyToOrder =
        orderDiscounts < 1 || (orderDiscounts >= 1 && coupon.recursive)

      if (canAddDiscount && canApplyToOrder) {
        Object.assign(
          {},
          await Discount.findOrCreate({
            order_id: order.id,
            coupon_id: coupon.id
          })
        )

        info.message = 'Coupon successfully applied'
        info.success = true
      } else {
        info.message = 'This coupon could not be applied'
        info.success = false
      }

      return response.status(200).send({ order, info })
    } catch (error) {
      return response.status(400).send({
        message: 'Error coupon clould not be apllied',
        error: error.stack
      })
    }
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async removeDiscount({ request, response }) {
    try {
      const { discount_id } = request.all()
      const discount = await Discount.findOrFail(discount_id)
      discount.merge({ deleted_at: new Date() })
      await discount.save()

      return response.status(200).send(discount)
    } catch (error) {
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }
}

module.exports = OrderController
