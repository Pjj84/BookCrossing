'use strict'
const Journey = use('App/Models/Journey')
class JourneyController {
    async create({request, response, params}){
        const j = new Journey
        j.story_id = params.story_id
    }
}

module.exports = JourneyController
