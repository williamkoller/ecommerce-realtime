'use strict'

const Schema = use('Schema')

class PermissionRoleTableSchema extends Schema {
  up() {
    this.create('permission_role', (table) => {
      table.increments()

      table.integer('permission_id').unsigned().index()
      table
        .foreign('permission_id')
        .references('id')
        .inTable('permissions')
        .onDelete('cascade')
      table.integer('role_id').unsigned().index()
      table
        .foreign('role_id')
        .references('id')
        .inTable('roles')
        .onDelete('cascade')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true })
    })
  }

  down() {
    this.drop('permission_role')
  }
}

module.exports = PermissionRoleTableSchema
