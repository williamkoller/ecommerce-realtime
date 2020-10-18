'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductSchema extends Schema {
  up() {
    this.create('products', (table) => {
      table.increments()
      table.string('name', 200)
      table.integer('image_id').unsigned()
      table.text('description')
      table.decimal('price', 12, 2)
      table.timestamps()

      table.foreign('image_id').references('id').inTable('images').onDelete('cascade')
    })
  }

  down() {
    this.drop('products')
  }
}

module.exports = ProductSchema
