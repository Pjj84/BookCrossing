'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StorySchema extends Schema {
  up () {
    this.create('stories', (table) => {
      table.increments()
      table.integer('book_id').notNullable()
      table.foreign('book_id').references('book.id')
      table.integer('journies') // The number of journies in this story
      table.integer('barcode').unique().unsigned()
      table.timestamps()
    })
  }

  down () {
    this.drop('stories')
  }
}

module.exports = StorySchema
