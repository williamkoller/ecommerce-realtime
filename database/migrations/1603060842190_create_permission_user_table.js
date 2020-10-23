'use strict'

const Schema = use('Schema')

class PermissionUserTableSchema extends Schema {
  up() {
    this.create('permission_user', (table) => {
      table
        .uuid('id')
        .unique()
        .defaultTo(this.db.raw('public.gen_random_uuid()'))
      table.uuid('permission_id').unsigned().index()
      table
        .foreign('permission_id')
        .references('id')
        .on('permissions')
        .onDelete('cascade')
      table.uuid('user_id').unsigned().index()
      table.foreign('user_id').references('id').on('users').onDelete('cascade')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true })
    })
  }

  down() {
    this.drop('permission_user')
  }
}

module.exports = PermissionUserTableSchema
