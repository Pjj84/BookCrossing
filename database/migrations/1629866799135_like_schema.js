'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LikeSchema extends Schema {
  up () {
    this.create('likes', (table) => {
      table.increments()
      table.integer('journey_id')
      table.foreign('journey_id').refrences('journey.id').onDelete('CASCADE')
      table.integer('book_id')
      table.foreign('book_id').refrences('books.id').onDelete('CASCADE')
      table.integer('user_id').notNullabe()
      table.foreign('user_id').refrences('user.id').onDelete('CASCADE')
      table.enum('type',['like','dislike'])
      table.timestamps()
    })
  }

  down () {
    this.drop('likes')
  }
}

module.exports = LikeSchema
