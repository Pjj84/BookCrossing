'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('email', 254).notNullable().unique()
      table.string('first_name',30)
      table.string('last_name',30)
      table.enum("role",['normal','admin']), { useNative: true, enumName: 'user_role'}
      table.enum('visibilty',['private','public']), { useNative: true, enumName: 'user_visibilty'}
      table.string('bio',120)
      table.string('profile').defaultTo('default.jpg')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
