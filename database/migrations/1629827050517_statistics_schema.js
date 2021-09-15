'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StatisticsSchema extends Schema {
  up () {
    this.create('statistics', (table) => {
      table.increments()
      table.integer('user_id').notNullable()
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      table.integer('books_registerd')
      table.integer('wild_releases')
      table.integer('controlled_releases')
      table.integer('wild_release_catches')
      table.integer('controlled_release_catches')
      table.integer('books_found') // The sum of wild_release_catches and controlled_release_catches
      table.timestamps()
    })
  }

  down () {
    this.drop('statistics')
  }
}

module.exports = StatisticsSchema
