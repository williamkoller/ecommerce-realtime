'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Product extends Model {
  /**
   * relationship between category and products
   */
  image() {
    return this.belongsTo('App/Models/Image')
  }

  /**
   * relationship between product and imagnes, product image gallery
   */
  images() {
    return this.belongsToMany('App/Models/Image')
  }

  /**
   * relationship between products and categories
   */
  categories() {
    return this.belongsToMany('App/Models/Category')
  }

  /**
   * relationship between products and discount coupons
   */
  coupons() {
    return this.belongsToMany('App/Models/Coupon')
  }
}

module.exports = Product
