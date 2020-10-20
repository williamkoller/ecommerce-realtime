'use strict'

const Schema = use('Schema')

class PermissionUserTableSchema extends Schema {
  up() {
    this.create('permission_user', table => {
      table.uuid('id').primary()
      table.uuid('permission_id').unsigned().index()
      table
        .foreign('permission_id')
        .references('id')
        .on('permissions')
        .onDelete('cascade')
      table.uuid('user_id').unsigned().index()
      table.foreign('user_id').references('id').on('users').onDelete('cascade')
      table.timestamps()
    })
  }

  down() {
    this.drop('permission_user')
  }
}

module.exports = PermissionUserTableSchema
