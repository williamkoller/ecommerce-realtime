'use strict'

const Schema = use('Schema')

class PermissionsTableSchema extends Schema {
  up() {
    this.create('permissions', (table) => {
      table
        .uuid('id')
        .unique()
        .defaultTo(this.db.raw('public.gen_random_uuid()'))

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
