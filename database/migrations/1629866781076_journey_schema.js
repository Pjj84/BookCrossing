'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class JourneySchema extends Schema {
  up () {
    this.create('journeis', (table) => {
      table.increments()
      table.integer('story_id').notNullabe()
      table.foreign('story_id').references('story.id').onDelete('CASCADE')
      table.string('released_in') // Format => City/Neighberhood
      table.timestamp('released_at').notNullable()
      table.text('description',200)
      table.enum('release_type',['wild','controlled']).noyNullable()
      table.integer('founder').notNullabe()
      table.foreign('founder').references('users.id').onDelete('CASCADE')
      table.string('reading_time') // Format => YYYY-MM-DDTHH:mm:ss
      table.timestamps()
    })
  }

  down () {
    this.drop('journeys')
  }
}

module.exports = JourneySchema
