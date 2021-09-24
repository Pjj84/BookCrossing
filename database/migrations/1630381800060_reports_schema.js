'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReportsSchema extends Schema {
  up () {
    this.create('reports', (table) => {
      table.increments()
      table.integer('reporter').notNullable()
      table.integer('book_id')
      table.integer('journey_id')
      table.integer('user_id')
      table.foreign('reporter').references('users.id').onDelete('CASCADE')
      table.foreign('book_id').references('books.id').onDelete('CASCADE')
      table.foreign('journey_id').references('journeys.id').onDelete('CASCADE')
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      table.enum('description',['inappropriate','offensive','sexual']),{ useNative: true, enumName: 'report_type'}
      table.timestamps()
    })
  }

  down () {
    this.drop('reports')
  }
}

module.exports = ReportsSchema
