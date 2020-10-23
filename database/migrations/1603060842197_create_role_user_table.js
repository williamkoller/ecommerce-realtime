'use strict'

const Schema = use('Schema')

class RoleUserTableSchema extends Schema {
  up() {
    this.create('role_user', (table) => {
      table
        .uuid('id')
        .unique()
        .defaultTo(this.db.raw('public.gen_random_uuid()'))
      table.uuid('role_id').unsigned().index()
      table.foreign('role_id').references('id').on('roles').onDelete('cascade')
      table.uuid('user_id').unsigned().index()
      table.foreign('user_id').references('id').on('users').onDelete('cascade')
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
