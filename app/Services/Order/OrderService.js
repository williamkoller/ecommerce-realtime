'use strict'

const Database = use('Database')

class OrderService {
  constructor(model, trx = false) {
    this.model = model
    this.trx = trx
  }

  async syncItems(items) {
    if (!Array.isArray(items)) return false
    await this.model.items().delete(this.trx)
    await this.modeli.items().createMany(items, this.trx)
  }

  async syncUpdateItems(items) {
    const currentItems = await this.model
      .items()
      .whereIn(
        'id',
        items.map((item) => item.id)
      )
      .fetch()

    // delete items that the user no longer wants
    await this.model
      .items()
      .whereNotIn(
        'id',
        items.map((item) => item.id)
      )
      .delete(this.trx)

    // updates values and quantities
    await Promise.all(
      currentItems.rows.map(async (item) => {
        item.fill(items.find((n) => n.id === item.id))
        await item.save(this.trx)
      })
    )
  }

  // check if the coupon not is associated with specific products and customers
  async canApplyDiscount(coupon) {
    const couponProducts = await Database.from('coupon_products')
      .where('coupon_id', coupon.id)
      .pluck('product_id')

    const couponClients = await Database.from('coupon_user')
      .where('coupon_id', coupon.id)
      .pluck('user_id')

    if (
      Array.isArray(couponProducts) &&
      couponProducts.length < 1 &&
      Array.isArray(couponClients) &&
      couponClients.length < 1
    ) {
      /**
       * if it is not associated with a specific customer or product, it is free to use
       */
      return true
    }

    let isAssociatedToProducts = false
    let isAssociatedToClients = false

    if (Array.isArray(couponProducts) && couponProducts.length > 0) {
      isAssociatedToProducts = true
    }

    if (Array.isArray(couponClients) && couponClients.length > 0) {
      isAssociatedToClients = true
    }

    const productsMatchs = await Database.from('order_items')
      .where('order_id', this.model.id)
      .whereIn('product_id', couponProducts)
      .fluck('product_id')

    // Use case 1 - Coupon is associated with customers and products
    if (isAssociatedToClients && isAssociatedToProducts) {
      const clientMacth = couponClients.find(
        (client) => client === this.model.user_id
      )

      if (
        clientMacth &&
        Array.isArray(productsMatchs) &&
        productsMatchs.length > 0
      ) {
        return true
      }
    }

    // Use case 2 - Coupon is only associated with product
    if (
      isAssociatedToProducts &&
      Array.isArray(productsMatchs) &&
      productsMatchs.length > 0
    ) {
      return true
    }

    // Use case 3 - Coupon is associated with one or more customers and no product
    if (
      isAssociatedToClients &&
      Array.isArray(couponClients) &&
      couponClients.length > 0
    ) {
      const macth = couponClients.find(
        (client) => client === this.model.user_id
      )
      if (macth) {
        return true
      }
    }

    /**
     * If none of the above checks are positive, then the coupon is associated with customers or products or both,
     * however none of the products in this order are eligible for the discount
     * and the customer who made the purchase will also not be able to use this coupon
     */

    return false
  }
}

module.exports = OrderService
