'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const Transformer = use('App/Transformers/Admin/OrderTransformer')
const Order = use('App/Models/Order')
const Coupon = use('App/Models/Coupon')
const Discount = use('App/Models/Discount')
const Database = use('Database')
const Service = use('app/Service/Order/OrderService')
const Ws = use('Ws')

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
   */
  async index({ request, response, transform, pagination, auth }) {
    try {
      const client = await auth.getUser()
      const number = request.input('number')
      const query = Order.query()

      if (number) {
        query.where('id', 'ilike', `${number}`)
      }

      query.where('user_id', client.id)

      const results = await query
        .orderBy('id', 'DESC')
        .paginate(pagination.page, pagination.limit)

      const orders = await transform.paginate(results, Transformer)

      return response.status(200).send(orders)
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
  async store({ request, response, transform, auth }) {
    const trx = await Database.beginTransaction()
    try {
      const client = await auth.getUser()
      const items = request.input('items')
      let order = Order.create({ user_id: client.id }, trx)
      const service = new Service(order, trx)

      if (items.length > 0) {
        await service.syncItems(items)
      }
      await trx.commit()

      order = await Order.find(order.id)
      order = await transform.include('items').item(order, Transformer)

      const topic = Ws.getchannel('notifications').topic('notifications')

      if (topic) {
        topic.broadcast('new:order', order)
      }

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
   */
  async show({ params: { id }, request, response, transform, auth }) {
    try {
      const client = await auth.getUser()
      const result = await Order.findOrFail({ id: id, user_id: client.id })
      const order = await transform.item(result, Transformer)
      return response.status(200).send(order)
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
  async update({ params, request, response, auth, transform }) {
    const trx = await Database.beginTransaction()
    try {
      const client = await auth.getUser()
      let order = await Order.findOrFail({ id: id, user_id: client.id })

      const { items, status } = request.all()

      order.merge({
        user_id: client.id,
        status
      })
      const service = new Service(order, trx)
      await service.syncUpdateItems(items)
      await order.save(trx)
      await trx.commit()

      order = await transform
        .include('items,coupons,discounts')
        .item(order, Transformer)
      return response.status(200).send(order)
    } catch (error) {
      await trx.rollback()
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }

  async applyDiscount({ params: { id }, request, response, transform, auth }) {
    try {
      const { code } = request.all()
      const client = await auth.getUser()
      const coupon = await Coupon.findByOrFail('code', code.toUpperCase())
      let order = await Order.findOrFail({ id: id, user_id: client.id })
      let discount = {}
      let info = {}
      const service = new Service(order)
      const canAddDiscount = await service.canApplyDiscount(coupon)

      const orderDiscounts = await order.coupons().getCount()

      const canApplyToOrder =
        orderDiscounts < 1 || (orderDiscounts >= 1 && coupon.recursive)

      if (canAddDiscount && canApplyToOrder) {
        discount = await Discount.findOrCreate({
          order_id: order.id,
          coupon_id: coupon.id
        })

        info.message = 'Coupon aply successfully'
        info.success = true
      } else {
        info.message = 'Coupon not apply'
        info.success = false
      }

      order = await transform
        .include('coupons,items,discounts')
        .item(order, Transformer)
      return response.status(201).send({ order, info })
    } catch (error) {
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }

  async removeDiscount({ request, response }) {
    try {
      const { discount_id } = request.all()

      const discount = await Discount.findOrFail(discount_id)

      discount.merge({
        deleted_at: new Date()
      })
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
