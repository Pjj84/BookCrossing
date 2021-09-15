'use strict'
const Journey = use('App/Models/Journey')
const Story = use('App/Models/story')
class JourneyController {
    async create({request, response, params}){
        try{
            const j = new Journey
            j.story_id = params.story_id
            j.released_in = request.input('location')
            j.description = request.input('description')
            if( request.input('found_in') ){
                j.found_in = request.input('found_in')
                j.founder = request.input('founder')
            }else if( request.input('released_in') ){
                j.released_in = request.input('released_in')
                j.release_type = request.input('release_type')
                if( request.input('reading_time') ){
                    j.reading_time = request.input('reading_time')
                }
            }
            return response.status(200)
        }catch(e){
            return response.status(500)
        }
    }   
    async book_journeys({request, response, params}){
        try{
            const story = await Story.query().where('book_id',request.id).with('journey').fetch()
            return response.status(200).josn({journey: story[0].journey})
        }catch(e){
            return response.status(500)
        }
    }
    async user_journeys({request, response, params}){
        try{
            const user = await User.query().where('id',request.id).with('journey').fetch()
            return response.status(200).json({journeys: user[0].journey})
        }catch(e){
            return response.status(500)
        }
    }
}

module.exports = JourneyController
