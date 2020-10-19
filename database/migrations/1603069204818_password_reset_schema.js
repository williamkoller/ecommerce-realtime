'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PasswordResetSchema extends Schema {
  up() {
    this.create('password_resets', table => {
      table.increments()
      table.string('email', 255).notNullable()
      table.string('token').notNullable().unique()
      table.dateTime('expires_at')
      table.timestamps()

      table
        .foreign('email')
        .references('email')
        .intable('users')
        .onDelete('cascade')
    })
  }

  down() {
    this.drop('password_resets')
  }
}

module.exports = PasswordResetSchema
