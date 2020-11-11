'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PasswordResetSchema extends Schema {
  up() {
    this.create('password_resets', (table) => {
      table.increments()

      table.string('email').notNullable()
      table.string('token').notNullable().unique()
      table.dateTime('expires_at')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true })
      table
        .foreign('email')
        .references('email')
        .inTable('users')
        .onDelete('cascade')
    })
  }

  down() {
    this.drop('password_resets')
  }
}

module.exports = PasswordResetSchema
