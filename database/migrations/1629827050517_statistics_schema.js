'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StatisticsSchema extends Schema {
  up () {
    this.create('statistics', (table) => {
      table.increments()
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      table.integer('books_registerd')
      table.integer('wild_releases')
      table.timestamps()
    })
  }

  down () {
    this.drop('statistics')
  }
}

module.exports = StatisticsSchema
