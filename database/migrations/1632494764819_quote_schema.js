'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class QuoteSchema extends Schema {
  up () {
    this.create('quotes', (table) => {
      table.increments()
      table.integer('user_id').notNullable()
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      table.text('text',300).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('quotes')
  }
}

module.exports = QuoteSchema
