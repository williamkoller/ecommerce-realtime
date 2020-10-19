'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CouponOrderSchema extends Schema {
  up() {
    this.create('coupon_order', table => {
      table.increments()
      table.decimal('total', 12, 2).defaultTo(0.0)
      table.integer('user_id').unsigned()
      table.enu('status', [
        'pending',
        'cancelled',
        'shipped',
        'paid',
        'finished',
      ])
      table.timestamps()

      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onDelete('cascade')
    })
  }

  down() {
    this.drop('coupon_order')
  }
}

module.exports = CouponOrderSchema
