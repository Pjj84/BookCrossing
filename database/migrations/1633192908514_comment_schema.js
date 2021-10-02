'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CommentSchema extends Schema {
  up () {
    this.create('comments', (table) => {
      table.increments()
      table.integer('book_id')
      table.foreign('book_id').references('books.id').onDelete('CASCADE')
      table.integer('user_id').notNullable()
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      table.integer('quote')
      table.foreign('quote').references('quotes.id').onDelete('CASCADE')
      table.text('text','long text')
      table.integer('replying_to')
      table.foreign('replying_to').references('comments.id').onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('comments')
  }
}

module.exports = CommentSchema
