'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StatisticsSchema extends Schema {
  up () {
    this.create('statistics', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('statistics')
  }
}

module.exports = StatisticsSchema
