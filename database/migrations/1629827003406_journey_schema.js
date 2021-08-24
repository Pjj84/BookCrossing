'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class JourneySchema extends Schema {
  up () {
    this.create('journeys', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('journeys')
  }
}

module.exports = JourneySchema
