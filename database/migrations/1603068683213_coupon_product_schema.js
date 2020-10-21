'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CouponProductSchema extends Schema {
  up() {
    this.create('coupon_product', table => {
      table.uuid('id').unique().defaultTo(this.db.raw('uuid_generate_v4()'))

      table.uuid('coupon_id').unsigned()
      table.uuid('product_id').unsigned()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true })
      table
        .foreign('coupon_id')
        .references('id')
        .inTable('coupons')
        .onDelete('cascade')

      table
        .foreign('product_id')
        .references('id')
        .inTable('products')
        .onDelete('cascade')
    })
  }

  down() {
    this.drop('coupon_product')
  }
}

module.exports = CouponProductSchema
