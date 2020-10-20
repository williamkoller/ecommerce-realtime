'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class OrderItem extends Model {
  static boot() {
    super.boot()
    this.addHook('beforeSave', 'OderItemHook.updateSubtotal')
  }

  static get traits() {
    return ['App/Models/Traits/NoTimestamps']
  }

  product() {
    return this.belongsTo('app/Models/Product')
  }

  order() {
    return this.belongsTo('App/Models/Order')
  }
}

module.exports = OrderItem
