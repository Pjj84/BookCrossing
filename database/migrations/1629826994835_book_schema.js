'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BookSchema extends Schema {
  up () {
    this.create('books', (table) => {
      table.increments()
      table.foreign('owner_id').references('user.id').notNullable().onDelete('CASCADE')
      table.string('current_postion') // Format => City/Neighberhood
      table.string('isbn',13)
      table.text('description',200)
      table.string('author',120)
      table.string('cover_image').defaultTo('default_image.jpg')
      table.enum('status',['pending','accepted']) 
      table.timestamps()
    })
  }

  down () {
    this.drop('books')
  }
}

module.exports = BookSchema
