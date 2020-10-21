'use strict'

const Schema = use('Schema')

class PermissionRoleTableSchema extends Schema {
  up() {
    this.create('permission_role', table => {
      table.uuid('id').unique().defaultTo(this.db.raw('uuid_generate_v4()'))
      table.uuid('permission_id').unsigned().index()
      table
        .foreign('permission_id')
        .references('id')
        .on('permissions')
        .onDelete('cascade')
      table.uuid('role_id').unsigned().index()
      table.foreign('role_id').references('id').on('roles').onDelete('cascade')
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
