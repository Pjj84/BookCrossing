'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Story extends Model {
    journeys (){
        return this.hasMany('App/Models/journey');
    }
}

module.exports = Story
