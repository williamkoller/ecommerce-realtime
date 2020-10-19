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
      table.integer('image_id').unsigned()
      table.timestamps()
    })
  }

  down() {
    this.drop('users')
  }
}

module.exports = UserSchema
