'use strict'
const Journey = use('App/Models/Journey')
const Story = use('App/Models/story')
class JourneyController {
    async create({request, response, params}){
        try{
            const j = new Journey
            j.story_id = params.story_id
            j.released_in = request.location
            j.description = request.description
            if( request.found_in ){
                j.found_in = request.found_in
                j.founder = request.founder
            }else if( request.released_in ){
                j.released_in = request.released_in
                j.release_type = request.release_type
                if( request.reading_time ){
                    j.reading_time = request.reading_time
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
