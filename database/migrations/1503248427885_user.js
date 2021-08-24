'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.enum("role",['normal','admin']), { useNative: true, enumName: 'user_role'}
      table.string('birthday',10) // Format => 'YYYY-MM-DD'
      table.string('location',100) // Format => Country/City
      table.string('bio',120)
      table.string('picture').defaultTo('default.jpg')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
