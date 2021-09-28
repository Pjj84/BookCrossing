'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NotificationSchema extends Schema {
  up () {
    this.create('notifications', (table) => {
      table.increments()
      table.integer('user_id')
      table.integer('creator_id')
      table.enum('table',['Book','Journeys','Report','Quote']),{ useNative: true, enumName: 'Table'}
      table.boolean('opened')
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      table.foreign('creator_id').references('users.id').onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('notifications')
  }
}

module.exports = NotificationSchema
