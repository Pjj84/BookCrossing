'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FriendshipSchema extends Schema {
  up () {
    this.create('friendships', (table) => {
      table.increments()
      table.integer('sender_id').notNullable()
      table.integer('receiver_id').notNullable()
      table.foreign('sender_id').references('users.id').onDelete('CASCADE')
      table.foreign('receiver_id').references('users.id').onDelete('CASCADE')
      table.enum('status',['pending','accepted']),{ useNative: true, enumName: 'friendship_status'}
      table.timestamps()
    })
  }

  down () {
    this.drop('friendships')
  }
}

module.exports = FriendshipSchema
