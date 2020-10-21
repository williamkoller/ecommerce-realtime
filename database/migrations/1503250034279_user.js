'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up() {
    this.create('users', table => {
      table.uuid('id').unique().defaultTo(this.db.raw('uuid_generate_v4()'))
      table.string('name', 80)
      table.string('surname', 200)
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.uuid('image_id').unsigned()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true })
    })
  }

  down() {
    this.drop('users')
  }
}

module.exports = UserSchema
