'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BookSchema extends Schema {
  up () {
    this.create('books', (table) => {
      table.increments()
      table.string('name',25).notNullabe()
      table.integer('owner_id').notNullable()
      table.foreign('owner_id').references('users.id')
      table.string('current_postion') // Format => City/Neighberhood
      table.string('isbn',13).notNullable()
      table.text('description',200).notNullable()
      table.string('author',120).notNullable()
      table.string('cover_image').defaultTo('default_image.jpg')
      table.enum('status',['pending','accepted']).notNullabe() 
      table.integer('rates').unsigend() // The number of rates submited
      table.integer('rating').unsigend() // The rating of the book
      table.timestamps()
    })
  }

  down () {
    this.drop('books')
  }
}

module.exports = BookSchema
