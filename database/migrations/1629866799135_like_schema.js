'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LikeSchema extends Schema {
  up () {
    this.create('likes', (table) => {
      table.increments()
      table.integer('book_id')
      table.foreign('book_id').references('books.id').onDelete('CASCADE')
      table.integer('user_id').notNullable()
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      table.integer('qoute_id')
      table.foreign('quote_id').references('qoutes.id').onDelete('CASCADE')
      table.enum('type',['like','dislike'])
      table.timestamps()
    })
  }

  down () {
    this.drop('likes')
  }
}

module.exports = LikeSchema
