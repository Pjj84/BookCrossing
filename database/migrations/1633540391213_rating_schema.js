'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RatingSchema extends Schema {
  up () {
    this.create('ratings', (table) => {
      table.increments()
      table.integer('book_id').notNullable()
      table.foreign('book_id').references('books.id').onDelete('CASCADE')
      table.integer('user_id')
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      table.integer('rating').unsigned()
      table.timestamps()
    })
  }

  down () {
    this.drop('ratings')
  }
}

module.exports = RatingSchema
