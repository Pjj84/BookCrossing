'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReportsSchema extends Schema {
  up () {
    this.create('reports', (table) => {
      table.increments()
      table.integer('reporter').notNulable()
      table.integer('book_id')
      table.integer('journey_id')
      table.foreign('reporter').references('users.id').onDelete('CASCADE')
      table.foreign('book_id').references('book.id').onDelete('CASCADE')
      table.foreign('journey_id').references('journey.id').onDelete('CASCADE')
      table.enum('description',['inappropriate','offensive','sexual']),{ useNative: true, enumName: 'report_type'}
      table.timestamps()
    })
  }

  down () {
    this.drop('reports')
  }
}

module.exports = ReportsSchema
