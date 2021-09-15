'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StorySchema extends Schema {
  up () {
    this.create('stories', (table) => {
      table.increments()
      table.integer('book_id').notNullable()
      table.foreign('book_id').references('books.id')
      table.integer('journeys') // The number of journeys in this story
      table.increments('barcode').unique().unsigned()
      table.timestamps()
    })
  }

  down () {
    this.drop('stories')
  }
}

module.exports = StorySchema
