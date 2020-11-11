'use strict'

const Schema = use('Schema')

class RolesTableSchema extends Schema {
  up() {
    this.create('roles', (table) => {
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
    this.drop('roles')
  }
}

module.exports = RolesTableSchema
