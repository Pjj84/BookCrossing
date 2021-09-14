'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class JourneySchema extends Schema {
  up () {
    this.create('journeys', (table) => {
      table.increments()
      table.integer('story_id').notNullable()
      table.foreign('story_id').references('stories.id').onDelete('CASCADE')
      table.string('released_in') // Format => City/Neighberhood
      table.string('found_in') // Format => 
      table.text('description',200)
      table.enum('release_type',['wild','controlled'])
      table.integer('user').notNullable()
      table.foreign('user').references('users.id').onDelete('CASCADE')
      table.string('reading_time') // Format => YYYY-MM-DDTHH:mm:ss
      table.timestamps()
    })
  }

  down () {
    this.drop('journeys')
  }
}

module.exports = JourneySchema
