'use strict'

const Schema = use('Schema')

class RoleUserTableSchema extends Schema {
  up() {
    this.create('role_user', (table) => {
      table.increments()

      table.integer('role_id').unsigned().index()
      table
        .foreign('role_id')
        .references('id')
        .inTable('roles')
        .onDelete('cascade')
      table.integer('user_id').unsigned().index()
      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onDelete('cascade')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true })
    })
  }

  down() {
    this.drop('role_user')
  }
}

module.exports = RoleUserTableSchema
