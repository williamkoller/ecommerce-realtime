'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ImageSchema extends Schema {
  up() {
    this.create('images', (table) => {
      table.increments()

      table.string('path', 255)
      table.integer('size').unsigned()
      table.string('original_name', 100)
      table.string('extension', 10)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true })
    })
  }

  down() {
    this.drop('images')
  }
}

module.exports = ImageSchema
