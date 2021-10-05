'use strict'
const Quote = use("App/Models/Quote")
const User = use("App/Models/User")
const Friendship = use("App/Models/Friendship")

class QuoteController {
    async create({request, response, params, auth}){
        try{
            const user = await auth.getUser()
            const quote = new Quote
            quote.user_id = user.id
            if( !request.input('text') ){ return response.status(400) }
            quote.text = request.input('text')
            quote.save()
            response.status(200)
            const friendships = await Database.select('sender_id','receiver_id').from('friendships').where('sender_id',user.id).orWhere('receiver_id',user.id)
            for(i=0;i<=friends_count;i++){
                const notif = new Notif
                notif.creator_id = user.id
                if( friendships[i].sender_id == user.id ){
                    notif.receiver_id = friendships[i].receiver_id                    
                }else{
                    notif.receiver_id = friendships[i].sender_id
                }
                notif.table = 'quotes'
                notif.opened = false
                notif.row_id = quote.id
                notif.save()
            }
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
    async show_by_user({request, response, params, auth}){ // In users route
        try{
            const user = await auth.getUser()
            const target = await User.findOrFail(params.user_id)
            if( !target ){ return response.status(404) }
            const friendship = await Friendship.query().where('sender_id',user.id).where('receiver_id',target.id).first() 
            || Friendship.query().where('sender_id',user_id).where('receiver_id',target.id).first()
            if( target.visibility == 'public' || friendship ){
                const quotes = await Quote.findOrFail(params.target_id)
            }else{
                return response.status(401)
            }
            return response.status(200).json({quotes: quotes})
        }catch(e){

        }
    }
}

module.exports = QuoteController
