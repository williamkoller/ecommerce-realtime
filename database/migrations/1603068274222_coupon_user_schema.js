'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CouponUserSchema extends Schema {
  up() {
    this.create('coupon_user', table => {
      table.uuid('id').unique().defaultTo(this.db.raw('uuid_generate_v4()'))

      table.uuid('coupon_id').unsigned()
      table.uuid('user_id').unsigned()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true })
      table
        .foreign('coupon_id')
        .references('id')
        .inTable('coupons')
        .onDelete('cascade')

      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onDelete('cascade')
    })
  }

  down() {
    this.drop('coupon_user')
  }
}

module.exports = CouponUserSchema
