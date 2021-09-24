'use strict'
const Quote = use("App/Models/Quote")
const User = use("App/Models/User")

class QuoteController {
    async create({request, response, params, auth}){
        try{
            const user = await auth.getUser()
            const quote = new Quote
            quote.user_id = user.id
            if( !request.input('text') ){ return response.status(400) }
            quote.text = request.input('text')
            quote.save()
            return response.status(200)
        }catch(e){
            return response.status(500)
        }
    }
    async delete({request, response, params, auth}){
        try{
            const quote = await Quote.findOrFail(params.quote_id)
            if( !quote ){ return response.status(404) }
            quote.delete()
            return response.status(200)
        }catch(e){
            return response.status(500)
        }
    }
    async show_by_user({request, response, params, auth}){
        try{
            const user = await User.findOrFail(params.user_id)
            if( !user ){ return response.status(404) }
            const quotes = await Quote.findOrFail(params.user_id)
            return response.status(200).json({quotes: quotes})
        }catch(e){

        }
    }
}

module.exports = QuoteController
