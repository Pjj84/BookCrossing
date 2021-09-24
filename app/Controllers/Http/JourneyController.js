'use strict'
const Journey = use('App/Models/Journey')
const Story = use('App/Models/story')
const Friendship = use("App/Models/Friendship")
class JourneyController {
    async create({request, response, params}){
        try{
            const story = await Story.findOrFail(params.story_id)
            if( !story ){ return response.status(400) }
            const book = await Book.findOrFail(story.book_id)
            if( !book ){ return response.status(400) }
            if( !request.input('isbn') || request.input('isbn') != book.isbn ){ return response.status(401) }
            const j = new Journey
            j.story_id = params.story_id
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
            }else{
                return response.status(400) // You should have either released or found the book
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
            const user = await auth.getuser()  
            const target = await User.query().where('id',request.id).with('journey').first()
            if( !target ){ return response.status(404) }
            const friendship = await Friendship.query().where('sender_id',user.id).where('receiver_id',target.id).first()
            || Friendship.query().where('sender_id',target.id).where('receiver_id',user.id).first()
            if( target.visibility == 'public' || friendship ){
                return response.status(200).json({journeys: target.journey})
            }else{
                return response.status(401) 
            }
        }catch(e){
            return response.status(500)
        }
    }
}

module.exports = JourneyController
