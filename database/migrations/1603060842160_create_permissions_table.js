'use strict'

const Schema = use('Schema')

class PermissionsTableSchema extends Schema {
  up() {
    this.create('permissions', (table) => {
      table.increments()
      table.string('slug').notNullable().unique()
      table.string('name').notNullable().unique()
      table.text('description').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true })
    })
  }

  down() {
    this.drop('permissions')
  }
}

module.exports = PermissionsTableSchema
