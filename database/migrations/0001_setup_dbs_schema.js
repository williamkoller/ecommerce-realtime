'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SetupdbSchema extends Schema {
  async up() {
    await this.db.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto";')
    await this.db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
  }

  down() {
    this.table('setup_dbs', table => {
      // reverse alternations
    })
  }
}

module.exports = SetupdbSchema
