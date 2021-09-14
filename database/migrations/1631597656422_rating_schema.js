'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RatingSchema extends Schema {
  up () {
    this.create('ratings', (table) => {
      table.increments()
      table.foreign('user_id').references("users.id").onDelete("CASCADE")
      table.integer('rate').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('ratings')
  }
}

module.exports = RatingSchema
